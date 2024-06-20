const mongoose = require("mongoose");
const { Schema } = mongoose;

const appointementSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    appointmentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["confirmed", "canceled", "completed"],
      required: true,
    },
    notes: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.export = mongoose.model("Appointement", appointementSchema);
