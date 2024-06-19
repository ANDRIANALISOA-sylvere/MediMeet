const mongoose = require("mongoose");
const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    personalInfo: {
      type: new Schema(
        {
          firstName: { type: String, required: true },
          lastName: { type: String, required: true },
          phone: { type: String },
          email: { type: String },
        },
        {
          _id: false,
        }
      ),
      required: true,
    },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    medicalHistory: [
      {
        condition: { type: String, required: true },
        diagnosisDate: { type: String, required: true },
        notes: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.export = mongoose.model("Patient", patientSchema);
