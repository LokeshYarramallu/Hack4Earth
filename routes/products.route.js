const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('./config');
const connection = mysql.createConnection(config);


async function getProducts() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products';
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
                
            } else {
                resolve(results);
            }
        });
    });
}

async function getrecentproducts() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE updated_at >= CURDATE() - INTERVAL 10 DAY';
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    })
}

async function addProduct(product) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO products SET ?';
        connection.query(query, [product], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


async function getProductbyID(id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE product_id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM products WHERE product_id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results.affectedRows > 0) {
                    resolve(1);
                } else {
                    resolve(0);
                }
            }
        });
    });
}

router.use(express.json());

router.get('/', async (req, res, next) => {
    try {
        const products = await getProducts();
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newproduct = req.body;
        const results = await addProduct(newproduct);
        if (results.affectedRows > 0) {
            res.status(201).send('Product added');
        }
        else {
            res.status(409).send('Product already exists');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/recent', async (req, res, next) => {
    try {
        const products = await getrecentproducts();
        res.status(200).send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await getProductbyID(id);
        res.status(200).send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        var deletestaus = await deleteProduct(id);
        console.log(deletestaus);
        if (deletestaus === 1) {
            res.send("Product deleted");
        }
        else {
            res.send("Product is not there");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})


module.exports = router;