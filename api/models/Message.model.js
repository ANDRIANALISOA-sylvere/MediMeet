const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    timestamp: { type: String, required: true },
    read: { type: Boolean, required: true },
    attachment: {
      type: {
        type: String,
        enum: ["pdf", "docx", "image"],
      },
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
