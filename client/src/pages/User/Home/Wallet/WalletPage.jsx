import React from 'react';
import { Box, Card, Typography, Button, Container } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const WalletPage = () => {
  // Dummy data
  const walletBalance = 25000;
  const walletLimit = 50000;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        My Wallet
      </Typography>
      
      <Card sx={{ 
        background: 'linear-gradient(135deg, #000000 0%, #1f1f1f 100%)',
        color: 'white',
        p: 4,
        borderRadius: '24px',
        mb: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          opacity: 0.1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          bottom: '-50%',
          left: '-50%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'rotate(45deg)',
        },
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          position: 'relative',
          zIndex: 1
        }}>
          <AccountBalanceWalletIcon sx={{ 
            fontSize: 48, 
            mr: 2,
            color: '#FFD700',
            filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.3))'
          }} />
          <Typography variant="h5" sx={{ 
            fontWeight: 500,
            background: 'linear-gradient(to right, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Wallet Balance
          </Typography>
        </Box>
        
        <Typography variant="h2" sx={{ 
          mb: 3,
          fontWeight: 700,
          background: 'linear-gradient(to right, #ffffff, #e0e0e0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          position: 'relative',
          zIndex: 1
        }}>
          ₹{walletBalance.toLocaleString()}
        </Typography>
        
        <Typography variant="body1" sx={{ 
          opacity: 0.7,
          position: 'relative',
          zIndex: 1,
          color: '#e0e0e0'
        }}>
          Wallet Limit: ₹{walletLimit.toLocaleString()}
        </Typography>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            px: 6,
            py: 1.5,
            borderRadius: '16px',
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #000000 30%, #1f1f1f 90%)',
            border: '1px solid rgba(255,215,0,0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            color: '#FFD700',
            '&:hover': {
              background: 'linear-gradient(45deg, #1f1f1f 30%, #000000 90%)',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
              borderColor: '#FFD700',
            }
          }}
        >
          Add Money
        </Button>
      </Box>
    </Container>
  );
};

export default WalletPage;