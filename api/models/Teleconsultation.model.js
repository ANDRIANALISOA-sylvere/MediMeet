const mongoose = require("mongoose");
const { Schema } = mongoose;

const teleconsultationSchema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointement",
      required: "true",
    },
    videoLink: { type: String, required: true },
    documents: { type: [String] },
    prescription: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.export = mongoose.model("Teleconsultation", teleconsultationSchema);
