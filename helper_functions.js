const qrcode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

const canvas = createCanvas(300, 300);
const ctx = canvas.getContext('2d');

function get_qrcode(message)
{
        var qr_code = '';

        message = String(message);
        qrcode.toDataURL(
               message, function(err, dataURL) {
            if (err) 
            {
                console.error(err);
            } 
            else 
            {
                console.log(dataURL);
                return dataURL;
            }
        });

}

module.exports.get_qrcode = get_qrcode;
//module.exports.get_qrcode_v2 = get_qrcode_v2