import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const translations = {
  EN: {
    title: 'Payment Failed',
    message: 'Something went wrong with your payment. Please try again.',
    tryAgain: 'Try Again',
    continueShopping: 'Continue Shopping',
  },
  AMH: {
    title: 'ክፍያ አልተሳካም',
    message: 'በክፍያዎ ላይ ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።',
    tryAgain: 'እንደገና ይሞክሩ',
    continueShopping: 'ግብይት ይቀጥሉ',
  },
};

const PaymentError = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('language') || 'EN';
  const text = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <ErrorIcon className="text-red-500 text-6xl mb-4" />
        <Typography variant="h4" className="text-habesha_blue font-medium mb-4">
          {text.title}
        </Typography>
        <Typography className="text-gray-600 mb-6">
          {text.message}
        </Typography>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="contained"
            onClick={() => navigate('/checkout')}
            className="bg-habesha_yellow hover:bg-yellow-500 text-habesha_blue font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            {text.tryAgain}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            className="bg-gray-200 hover:bg-gray-300 text-habesha_blue font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <ShoppingBagIcon />
            {text.continueShopping}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;