const express = require("express");
const router = express.Router();
const mapController = require("../controllers/Map.controller");

router.post("/map", mapController.createMap);
router.get("/map/:doctorId", mapController.getMapByDoctorId);
router.put("/map/:doctorId", mapController.updateMap);
router.delete("/map/:doctorId", mapController.deleteMap);

module.exports = router;
