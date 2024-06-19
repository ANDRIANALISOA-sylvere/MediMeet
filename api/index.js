const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
dotenv.config();

const app = express();

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

app.listen(process.env.PORT, () => {
  console.log(`server run on the PORT ${process.env.PORT}`);
});
