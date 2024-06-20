const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const session = require('express-session');
const cors = require("cors");
const connectDB = require("./config/db");
const userRoute = require("./routes/User.route");
const passport = require("passport");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");

const PORT = process.env.PORT || 8800;

connectDB();

app.use("/auth", userRoute);

app.listen(PORT, () => {
  console.log(`server run on the PORT ${PORT}`);
});
