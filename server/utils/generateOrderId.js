const crypto = require("crypto");

function generateOrderId(userId) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const timestamp = date.getTime();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);

  const UserIdHash = crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex")
    .slice(0, 4);

  return `INF-${year}${month}${day}-${timestamp}-${UserIdHash}-${randomDigits}`;
}

module.exports = { generateOrderId };
