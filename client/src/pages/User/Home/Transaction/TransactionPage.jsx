import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Chip,
  Box,
  CircularProgress
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PendingIcon from '@mui/icons-material/Pending';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatPrice, formatDate } from '@/lib/utils';

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/wallet/transactions`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'credit':
        return <AddCircleIcon sx={{ color: 'success.main' }} />;
      case 'debit':
        return <RemoveCircleIcon sx={{ color: 'error.main' }} />;
      default:
        return <PendingIcon sx={{ color: 'warning.main' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Transaction History
      </Typography>

      {transactions.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography color="text.secondary">
            No transactions found
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <List>
            {transactions.map((transaction) => (
              <ListItem
                key={transaction._id}
                divider
                sx={{ 
                  py: 2,
                  '&:last-child': { borderBottom: 'none' }
                }}
              >
                <ListItemIcon>
                  {getTransactionIcon(transaction.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle1" component="span">
                        {transaction.description}
                      </Typography>
                      <Chip
                        size="small"
                        label={transaction.status}
                        color={getStatusColor(transaction.status)}
                      />
                    </Box>
                  }
                  secondary={formatDate(transaction.createdAt)}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: transaction.type === 'credit' ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}
                >
                  {transaction.type === 'credit' ? '+' : '-'}{formatPrice(transaction.amount)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default TransactionPage;