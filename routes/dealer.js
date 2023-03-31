const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

//to connect to the database
const db_service = require('../db_service');
const { json } = require('body-parser');



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

    res.render('dealer/login', { 'title' : 'Dealer Login Portal'})
});


router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log('username: '+username+'\npassword: '+password);


    db_service.validate_user(username, password, 'dealer', function(error, status){

        console.log("Inside callback function\n")
        if(error)
        {
            console.log('Error occured!');
            console.log(error);
            console.log('This is error status\n\\n')
        }
        else
        {
            console.log('This is status\n\\n')
            console.log(status)
            if(status === true)
                res.send('Dealer Verified');
            else 
                res.send('Dealer Login Failed!');
        }
        console.log('hey there this is callback function');

    });

})

router.get('/scan_qrcode', (req, res) => 
{
    res.render('dealer/scan_qrcode' )
});



router.post('/scan_qrcode', (req, res) =>
{
    const product_details = JSON.parse(req.body.qrCode);
    console.log(product_details)

    // contract.methods.add_dealer(id, name, price, manufacturer_id).send({'from' : account})
    // .then(function(result) {
    //     //console.log(result);
    //     //res.send('Product Added to Blockchain Successfully!\n\nTransaction Details: '+JSON.stringify(result, null, 2));
    //     console.log('Product added to the blockchain successfully!')
    // })
    // .catch(function(error) {
    //     console.error(error);
    // }) 
    res.send('dealer/login');

    const product_id = product_details.product_id;
    const manufacturer_id = product_details.manufacturer_id;

    //change dealer id below to make it dynamic
    const dealer_id = 1;

    contract.methods.add_dealer(product_id, dealer_id, manufacturer_id).send({'from' : account})
    .then(function(result) {
        //console.log(result);
        console.log('Dealer id added to the product in blockchain successfully!')
    })
    .catch(function(error) {
        console.error(error);
    }) 
})

router.get('/home', (req, res) => {

});

module.exports = router;



