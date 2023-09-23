const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const productRoute = require("./routes/products.route");
const sellersroute = require("./routes/sellerprofile.route");
const customersroute = require("./routes/customer.route");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/products", productRoute);
app.use("/sellers", sellersroute);
app.use("/customers", customersroute);
app.get("/signin", (req, res) => {
  res.sendFile(__dirname + "/views/signin_signup.html");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(3000, () => {
  console.log("Server is running at : " + `http://localhost:3000`);
});
