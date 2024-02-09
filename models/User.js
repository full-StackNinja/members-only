const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    length: { min: 6, max: 15 },
  },
  membership: { type: Boolean, required: true, lowercase: true },
  admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
