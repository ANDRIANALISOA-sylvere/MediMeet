const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "appointmentConfirmation",
        "appointmentReminder",
        "appointmentCancellation",
      ],
    },
    message: { type: String, required: true },
    sentAt: { type: Date },
    read: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
