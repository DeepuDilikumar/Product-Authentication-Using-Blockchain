//importing express
const { response } = require('express');
const express = require('express');
const app = express();

//importing connection from puppeteer
const { Connection } = require('puppeteer');

//for using environment variables
const dotenv = require('dotenv');
dotenv.config();

//to read the request header details
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false}));

//Creating session data
const session = require('express-session');
app.use( session({
    secret: 'sample_secret_key',
    resave: false,
    saveUninitialized: true
}))



//to connect to the database
const db_service = require('./db_service')

//setting the view engine to 'ejs'
app.set('view engine', 'ejs');
app.set('views', './views');

const helpers = require('./helper_functions')



// web 3 code below

const Web3 = require('web3');
const configuration = require('./build/contracts/ProductTracking.json');
const { MusicGenreFeed } = require('instagram-private-api');

const CONTRACT_ADDRESS = configuration.networks["5777"].address;
const CONTRACT_ABI = configuration.abi;

//console.log((CONTRACT_ABI));

const web3 = new Web3('http://127.0.0.1:7545');

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS); 

let account;

//getting accounts from MetaMask
// web3.eth.getAccounts()
//   .then(function (accounts) {
//     account = accounts[0];
//   })
//   .catch(function (error) {
//     console.log('Error Occured while getting accounts from MetaMask!');
//     console.log(error);
//   });

async function getAccount() {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        return account;
    } catch (error) {
        console.log('Error Occurred while getting accounts from MetaMask!');
        console.log(error);
        throw error; // re-throw the error to the caller
    }
}

// Call the function and use the returned value
(async function() {
    try {
        const account = await getAccount();
        //console.log(account);
        // other synchronous code here that depends on account
    } catch (error) {
        console.log('Error Occurred!');
        console.log(error);
    }
})();
  
//web3 code ends

const dealer_routes = require('./routes/dealer');
const manufacturer_routes = require('./routes/manufacturer');
const customer_routes = require('./routes/customer')

app.use('/dealer', dealer_routes);
app.use('/manufacturer', manufacturer_routes);
app.use('/', customer_routes);

app.get('/', (req, res) => {
    res.send('Welcome to Product Authenticity Checking using Blockchain!');
})


app.listen(process.env.PORT, () => {console.log('Listening to the server on http://localhost:8000')});

module.exports.account = account;