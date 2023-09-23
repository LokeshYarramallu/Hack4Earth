const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const config = require("./config");
const e = require("express");
const connection = mysql.createConnection(config);

async function verifyCustomer(email, password) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM CustomerProfiles WHERE email = ? AND password = ?";
    connection.query(query, [email, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function addCustomer(customer) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO CustomerProfiles SET ?";
    connection.query(query, customer, (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          const errorMessage = "Customer already registered";
          return reject(errorMessage);
        }
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

async function getCustomerById(id) {
  try {
    const query1 = "SELECT * FROM CustomerProfiles WHERE profile_id = ?";
    const query2 = "SELECT * FROM purchase_records WHERE customer_id = ?";

    const results1 = await new Promise((resolve, reject) => {
      connection.query(query1, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    const results2 = await new Promise((resolve, reject) => {
      connection.query(query2, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    return { customerProfile: results1, purchaseRecords: results2 };
  } catch (error) {
    throw error;
  }
}

async function buyProduct(ids) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO purchase_records SET ?";
    connection.query(query, ids, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

router.use(express.json());
router.use(express.static('public'));


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const results = await verifyCustomer(email, password);
  if (Object.keys(results).length === 0) {
    res.status(205).send(results);
  } else {
    // res.redirect('home');
    res.status(201).send(results);
  }
});

router.post("/register", async (req, res) => {
  const customer = req.body;

  try {
    await addCustomer(customer);
    res.send("Customer Added");
  } catch (error) {
    if (error === "Customer already registered") {
      res.status(409).send("Customer already registered");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const results = await getCustomerById(id);
  res.send(results);
});

router.post("/buy", async (req, res) => {
  const ids = req.body;
  const results = await buyProduct(ids);
  res.send(results);
});

module.exports = router;
