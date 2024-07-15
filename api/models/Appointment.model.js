const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointementSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "cancelled", "completed"],
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointement", appointementSchema);
