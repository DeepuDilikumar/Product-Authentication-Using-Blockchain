const express = require('express');
const router = express.Router();

//to connect to the database
const db_service = require('../db_service')

//importing helper functions
const helper = require('../helper_functions');

//importing required libraries for qrcode generation
const qrcode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

const canvas = createCanvas(300, 300);
const ctx = canvas.getContext('2d');

const server = require('../server')



// CHANGE BELOW CODE!!! (Make contract and account variable import from server.js)!!!!

// web 3 code below

const Web3 = require('web3');
const configuration = require('../build/contracts/ProductTracking.json');
const { MusicGenreFeed } = require('instagram-private-api');

const CONTRACT_ADDRESS = configuration.networks["5777"].address;
const CONTRACT_ABI = configuration.abi;

//console.log((CONTRACT_ABI));

const web3 = new Web3('http://127.0.0.1:7545');

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS); 

let account;

//getting accounts from MetaMask
web3.eth.getAccounts()
  .then(function (accounts) {
    account = accounts[0];
  })
  .catch(function (error) {
    console.log('Error Occured while getting accounts from MetaMask!');
    console.log(error);
  });

//web 3 code ends



router.get('/login', (req, res) => {
    console.log(server.account)
    res.render('manufacturer/login', { 'title': 'Manufacturer Login Portal'})
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const status = db_service.validate_user(username, password, 'manufacturer');
    if(status === true)
        res.send('Manufacturer Verified');
    else 
        res.send('Manufacturer Login Failed!');

})

router.get('/home', (req, res) => {

    const manufacturer_id = 1;
    
    //const results = await db_service.get_products_added_by_v2(manufacturer_id)
    res.render('manufacturer/home', { 'title' : 'Home'});
})

router.get('/generate_qrcode', (req, res) => {
    
    const manufacturer_id = 1;
    const product_id = 1234;

    let message = {
        'manufacturer_id' : manufacturer_id,
        'product_id' : product_id
    }

    message = JSON.stringify(message);

    qrcode.toDataURL(message, function(err, dataURL) {
        if (err) 
        {
            console.error(err);
            res.render('manufacturer/generate_qrcode',  {'title' : 'QR Code Generation', 'qrcode': '', 'image_name' : ''})
        } 
        else 
        {
            res.render('manufacturer/generate_qrcode',  {'title' : 'QR Code Generation', 'qrcode': dataURL, 'image_name' : String(manufacturer_id)+'-'+String(product_id)});
        }
    });
     
})

router.get('/add_product', (req, res) => {
    res.render('manufacturer/add_product', {'title': 'Add Product'});
})

router.post('/add_product', (req, res) =>
{

    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const manufacturer_id = 1;

    //1. adding the product in mySQL database
    db_service.add_product(id, name, price, manufacturer_id);


    //2. adding the product in blockchain using deployed smart contract
    const gas_limit = 500000; //Note: default gas limit = 20000, so sometimes out of gas exception arises if it needs more than that

    contract.methods.add_product(id, name, price, manufacturer_id).send({'from' : account, gas: gas_limit})
    .then(function(result) {
        //console.log(result);
        //res.send('Product Added to Blockchain Successfully!\n\nTransaction Details: '+JSON.stringify(result, null, 2));
        console.log('Product added to the blockchain successfully!')
    })
    .catch(function(error) {
        console.error(error);
    }) 



    //generating the corresponding QR-code from the product

    const product_id = id;
    let message = {
        'manufacturer_id' : manufacturer_id,
        'product_id' : id
    }

    message = JSON.stringify(message);

    qrcode.toDataURL(message, function(err, dataURL) {
        if (err) 
        {
            console.error(err);
            res.render('manufacturer/display_qrcode',  {'title' : 'QR Code Generation', 'qrcode': '', 'image_name' : ''})
        } 
        else 
        {
            res.render('manufacturer/display_qrcode',  {'title' : 'QR Code Generation', 'qrcode': dataURL, 'image_name' : String(manufacturer_id)+'-'+String(product_id)});
        }
    });

})

module.exports = router;
