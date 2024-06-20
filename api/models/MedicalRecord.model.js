const mongoose = require("mongoose");
const { Schema } = mongoose;

const recordSchema = new Schema(
  {
    date: { type: Date, required: true },
    description: { type: String },
    attachments: { type: [String] },
  },
  { _id: false }
);

const medicalrecordSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    records: { type: [recordSchema], required: true },
  },
  {
    timestamps: true,
  }
);

module.export = mongoose.model("MedicalRecord", medicalrecordSchema);
