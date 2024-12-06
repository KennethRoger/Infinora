const mongoose = require("mongoose");

const TempUserSchema = mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, default: null },
  phoneNumber: { type: String, default: null },
  password: { type: String, default: null },
  otp: { type: String, default: null },
  expiredAt: { type: Date, default: Date.now, index: { expires: "5m" } },
});

const TempUser = mongoose.model("TempUser", TempUserSchema);
module.exports = TempUser;
