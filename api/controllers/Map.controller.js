const Map = require("../models/Map.model");

exports.createMap = async (req, res) => {
  try {
    const { doctor, latitude, longitude, address } = req.body;
    const newMap = new Map({
      doctor,
      latitude,
      longitude,
      address,
    });
    const savedMap = await newMap.save();
    res.status(201).json(savedMap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMapByDoctorId = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const map = await Map.findOne({ doctor: doctorId });
    if (!map) {
      return res
        .status(404)
        .json({ message: "Carte non trouvée pour ce docteur" });
    }
    res.status(200).json(map);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMap = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const updatedMap = await Map.findOneAndUpdate(
      { doctor: req.params.doctorId },
      { latitude, longitude, address },
      { new: true }
    );
    if (!updatedMap) {
      return res
        .status(404)
        .json({ message: "Carte non trouvée pour ce docteur" });
    }
    res.status(200).json(updatedMap);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMap = async (req, res) => {
  try {
    const deletedMap = await Map.findOneAndDelete({
      doctor: req.params.doctorId,
    });
    if (!deletedMap) {
      return res
        .status(404)
        .json({ message: "Carte non trouvée pour ce docteur" });
    }
    res.status(200).json({ message: "Carte supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
