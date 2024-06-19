const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const connectDB = require("./config/db")
dotenv.config();

const app = express();

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 8800;

connectDB();

app.listen(PORT, () => {
  console.log(`server run on the PORT ${PORT}`);
});
