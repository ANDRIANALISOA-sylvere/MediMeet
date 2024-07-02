const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Patient", "Docteur"], required: true },
    phone: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
    phoneVerified: { type: Boolean, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
