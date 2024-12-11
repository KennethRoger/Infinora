const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  phoneNumber: {type: String, required: true},
  pincode: { type: String, required: true },
  locality: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
});

Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
