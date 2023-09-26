const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const multer = require("multer");
const path = require("path");
const productRoute = require("./routes/products.route");
const sellersroute = require("./routes/sellerprofile.route");
const customersroute = require("./routes/customer.route");
app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(__dirname + "/clientjs"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/products", productRoute);
// app.use("/sellers", sellersroute);
app.use("/customers", customersroute);
app.get("/signin", (req, res) => {
  res.sendFile(__dirname + "/views/signin_signup.html");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({ url: publicUrl });
});

app.listen(80, () => {
  console.log("Server is running at : " + `http://localhost:80`);
});
