const mongoose = require("mongoose");

const TempUserSchema = mongoose.Schema({
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  expiredAt: { type: Date, default: Date.now, index: { expires: "5m" } },
});

const TempUser = mongoose.model("TempUser", TempUserSchema);
module.exports = TempUser;
