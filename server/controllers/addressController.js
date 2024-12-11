const Address = require("../models/Address");

const addAddress = (req, res) => {
  const { name, phoneNumber, pincode, locality, address, district, state } =
    req.body;
  console.log(req.body);

  res.status(200).json({ success: true, message: "Added address" });
};

module.exports = { addAddress };
