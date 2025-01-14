import React, { useState, useEffect } from "react";
import { Box, Card, Typography, Button, Container } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import axios from "axios";
import toast from "react-hot-toast";
import { addMoneyToWallet, verifyWalletPayment } from "@/api/wallet/walletApi";
import Modal from "@/components/Modal/Modal";

const WalletPage = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/wallet/balance`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch wallet balance"
      );
    }
  };

  const handleAddMoney = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const response = await addMoneyToWallet(Number(amount));

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Infinora",
        description: "Add money to wallet",
        order_id: response.order.id,
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
            };

            const verificationResponse = await verifyWalletPayment(
              verificationData
            );
            if (verificationResponse.success) {
              toast.success("Money added to wallet successfully!");
              setAmount("");
              fetchWalletBalance();
              setShowAddMoneyModal(false);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            toast.error(error.message || "Failed to verify payment");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#4338ca",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      toast.error(error.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        My Wallet
      </Typography>

      <Card
        sx={{
          background: "linear-gradient(135deg, #000000 0%, #1f1f1f 100%)",
          color: "white",
          p: 4,
          borderRadius: "24px",
          mb: 4,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
            opacity: 0.1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-50%",
            bottom: "-50%",
            left: "-50%",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
            transform: "rotate(45deg)",
          },
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          <AccountBalanceWalletIcon
            sx={{
              fontSize: 48,
              mr: 2,
              color: "#FFD700",
              filter: "drop-shadow(0 2px 4px rgba(255,215,0,0.3))",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              background: "linear-gradient(to right, #FFD700, #FFA500)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Wallet Balance
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            mb: 3,
            fontWeight: 700,
            background: "linear-gradient(to right, #ffffff, #e0e0e0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            position: "relative",
            zIndex: 1,
          }}
        >
          ₹{walletBalance.toLocaleString()}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            opacity: 0.7,
            position: "relative",
            zIndex: 1,
            color: "#e0e0e0",
          }}
        ></Typography>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowAddMoneyModal(true)}
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: "16px",
            textTransform: "none",
            fontSize: "1.1rem",
            fontWeight: 600,
            background: "linear-gradient(45deg, #000000 30%, #1f1f1f 90%)",
            border: "1px solid rgba(255,215,0,0.3)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
            color: "#FFD700",
            "&:hover": {
              background: "linear-gradient(45deg, #1f1f1f 30%, #000000 90%)",
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.3)",
              borderColor: "#FFD700",
            },
          }}
        >
          Add Money
        </Button>
      </Box>

      <Modal isOpen={showAddMoneyModal}>
        <h2 className="text-2xl font-semibold mb-4">Add Money to Wallet</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddMoneyModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMoney}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {loading ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default WalletPage;
