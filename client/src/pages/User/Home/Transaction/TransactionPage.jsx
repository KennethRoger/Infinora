import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Chip,
  Box
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PendingIcon from '@mui/icons-material/Pending';

const TransactionPage = () => {
  // Dummy transaction data
  const transactions = [
    {
      id: 1,
      type: 'credit',
      amount: 5000,
      description: 'Added money to wallet',
      date: '2025-01-06',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 2500,
      description: 'Purchase: Premium Subscription',
      date: '2025-01-05',
      status: 'completed'
    },
    {
      id: 3,
      type: 'pending',
      amount: 1500,
      description: 'Refund from cancelled order',
      date: '2025-01-04',
      status: 'pending'
    },
    {
      id: 4,
      type: 'debit',
      amount: 3000,
      description: 'Service payment',
      date: '2025-01-03',
      status: 'completed'
    }
  ];

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'credit':
        return <AddCircleIcon sx={{ color: 'success.main' }} />;
      case 'debit':
        return <RemoveCircleIcon sx={{ color: 'error.main' }} />;
      case 'pending':
        return <PendingIcon sx={{ color: 'warning.main' }} />;
      default:
        return <AddCircleIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Transaction History
      </Typography>

      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <List>
          {transactions.map((transaction) => (
            <ListItem
              key={transaction.id}
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
                      label={transaction.status}
                      size="small"
                      color={getStatusColor(transaction.status)}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {transaction.date}
                  </Typography>
                }
              />
              <Typography 
                variant="subtitle1" 
                color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                sx={{ fontWeight: 'bold' }}
              >
                {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TransactionPage;
