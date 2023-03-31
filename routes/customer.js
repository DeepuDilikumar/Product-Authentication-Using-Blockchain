const express = require('express');
const router = express.Router();

//to connect to the database
const db_service = require('../db_service')

//importing helper functions
const helper = require('../helper_functions');

//to read the request header details
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false}));

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





router.get('/',  (req, res) => {
    res.render('customer/home.ejs', {'title' : 'Customer - Home'});
});

router.post('/', (req, res) => {
    const product_id = req.body.product_id;

    contract.methods.get_product_info(product_id).send({'from':account})
    .then(function(result) {
        console.log(result);
        res.send('Product Information is: '+JSON.stringify(result));
    })
    .catch(function(error) {
        console.error(error);
    }) 

})



module.exports = router;