const express = require('express');
const router = express.Router();

//to connect to the database
const db_service = require('../db_service')

router.get('/login', (req, res) => {

    res.render('dealer/login', { 'title' : 'Dealer Login Portal'})
});


router.get('/scan_qrcode', (req, res) => {
    res.render('testing/test', {'title' : 'Scan QR Code'});
})
module.exports = router;



