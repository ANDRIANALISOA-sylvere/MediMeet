const express = require("express");
const { getAllMessages } = require("../controllers/Message.controller");
const router = express.Router();

router.get("/messages/:userId/:doctorId", getAllMessages);

module.exports = router;
