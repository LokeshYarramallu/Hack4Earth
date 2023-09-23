const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('./config');
const connection = mysql.createConnection(config);

async function verifyseller(seller_email, seller_password){
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM sellers WHERE seller_email = ? AND seller_password = ?';
        connection.query(query, [seller_email, seller_password], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getSellerByID(seller_id) {
    try {
        const query1 = 'SELECT * FROM sellers WHERE seller_id = ?';
        const query2 = 'SELECT * FROM products WHERE seller_id = ?';
        
        const results1 = await new Promise((resolve, reject) => {
            connection.query(query1, [seller_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        const results2 = await new Promise((resolve, reject) => {
            connection.query(query2, [seller_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return { seller: results1, products: results2 };
    } catch (error) {
        throw error;
    }
}

async function addSeller(seller) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO sellers SET ?';
        connection.query(query, [seller], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Handle the duplicate entry error
                    const errorMessage = "Seller already registered";
                    return reject(errorMessage);
                }
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}



async function allsellers() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM sellers';
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

router.use(express.json());

router.post('/login', async (req, res) => {
    const { seller_email, seller_password } = req.body;  
    const result = await verifyseller(seller_email, seller_password);
    res.send(result);
  });

router.get('/:seller_id', async (req, res) => {
    const { seller_id } = req.params;
    const result = await getSellerByID(seller_id);
    res.send(result);
  });


  router.post('/register-seller', async (req, res) => {
    const seller = req.body;
    
    try {
        await addSeller(seller);
        res.send("Seller Added");
    } catch (error) {
        if (error === "Seller already registered") {
            res.status(409).send("Seller already registered");
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
});

router.get('/', async (req, res) => {
    const result = await allsellers();
    res.send(result);
})
  
module.exports = router
