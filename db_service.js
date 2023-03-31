const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

console.log(' this is: ', process.env.USERNAME)
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect ((err) => {
    if(err)
    {
        console.log(err.message);
    }
    else
    {
        console.log('db ' + connection.state);
    }
});


function validate_user(username, password, manufacturer_or_dealer)
{

    let sql = '';
    if (manufacturer_or_dealer === 'manufacturer')
        sql_query = 'select * from manufacturer where username = ? and password = ?;' ;
    else
        sql_query = 'select * from dealer where username = ? and password = ?;';
        
    connection.query(
        sql_query,
        [username, password],
        (err, results, fields) => {
            if(err) throw err;

            let account_exists = false;
            if (results.length > 0){
                console.log('Account exists!')
                account_exists = true
            }
            else
            {
                console.log('Account does not exists!')
                account_exists = false;
            }

            console.log('Value of account_exists: '+String(account_exists));
            if(account_exists)
                return true;
            else    
                return false;
        }
    )

}

function add_product(id, name, price, manufacturer_id,)
{
    const sql_query = 'INSERT INTO product (id, name, price, manufacturer_id) VALUES ( ?, ?, ?,? )';
    const values = [id, name, price, manufacturer_id];

    connection.query(sql_query, values, (err, result) => {
        if(err)
        {
            console.log('Error writing to database! \n', err);
        }
        else
        {
            console.log('Data written to database successfully!')
        }
    })
}

function get_products_added_by(manufacturer_id)
{
    const sql_qury = 'SELECT * FROM product WHERE manufacturer_id = ?';
    const values = [manufacturer_id];

    connection.query(sql_query, values, (err, results, fields) => {
        if(err)
        {
            console.log('Getting products added by '+String(manufacturer_id)+' query failed!');
        }
        else
        {
            return results;
        }
    })
}

async function get_products_added_by_v2(manufacturer_id) {

    const sql_qury = 'SELECT * FROM product WHERE manufacturer_id = ?';
    const values = [manufacturer_id];

    return new Promise((resolve, reject) => {
      db.query(sql_qury, values, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

module.exports.validate_user = validate_user;
module.exports.add_product = add_product;
module.exports.get_products_added_by_v2 = get_products_added_by_v2;