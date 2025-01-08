const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transactions');

const createWalletTransaction = async ({
  userId,
  amount,
  type,
  description,
  reference,
  paymentMethod,
  orderId
}) => {
  try {
    // Find or create wallet
    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      { 
        userId,
        $inc: { balance: type === 'credit' ? amount : -amount }
      },
      { upsert: true, new: true }
    );

    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      amount,
      type,
      description,
      reference,
      paymentMethod,
      orderId,
      balance: wallet.balance,
      status: 'completed'
    });

    return { wallet, transaction };
  } catch (error) {
    throw new Error(`Failed to create wallet transaction: ${error.message}`);
  }
};

module.exports = createWalletTransaction;