const mongoose = require("mongoose");
const { Schema } = mongoose;

const mapSchema = new Schema(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Map", mapSchema);
