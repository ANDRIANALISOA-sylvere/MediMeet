const express = require("express");
const { Register } = require("../controllers/User.controller");
const router = express.Router();

router.post("/register", Register);

module.exports = router;
