const mongoose = require("mongoose");

const TempUserSchema = mongoose.Schema({
  name: { type: String, required: true, default: null },
  email: { type: String, required: true, default: null },
  phoneNumber: { type: String, required: true, default: null },
  password: { type: String, required: true, default: null },
  otp: { type: String, required: true, default: null },
  expiredAt: { type: Date, default: Date.now, index: { expires: "5m" } },
});

const TempUser = mongoose.model("TempUser", TempUserSchema);
module.exports = TempUser;
