const mongoose = require("mongoose");
const { Schema } = mongoose;

const availabilitySchema = new Schema(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
  },
  { _id: false }
);

const doctorSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    specialty: { type: String, required: true },
    experience: { type: Number, required: true },
    price: { type: Number, required: true },
    about: { type: String, required: true },
    location: { type: String, required: true },
    availability: [availabilitySchema],
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
