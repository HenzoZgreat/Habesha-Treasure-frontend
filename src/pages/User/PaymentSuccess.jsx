import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const translations = {
  EN: {
    title: 'Payment Successful',
    message: 'Thank you for your purchase! Your order has been successfully placed.',
    orderDetails: 'You will receive an order confirmation soon.',
    continueShopping: 'Continue Shopping',
  },
  AMH: {
    title: 'ክፍያ ስኬታማ ነው',
    message: 'ለግዢዎ እናመሰግናለን! ትዕዛዝዎ በተሳካ ሁኔታ ተቀምጧል።',
    orderDetails: 'በቅርቡ የትዕዛዝ ማረጋገጫ ይደርስዎታል።',
    continueShopping: 'ግብይት ይቀጥሉ',
  },
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('language') || 'EN';
  const text = translations[language];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <CheckCircleIcon className="text-green-500 text-6xl mb-4" />
        <Typography variant="h4" className="text-habesha_blue font-medium mb-4">
          {text.title}
        </Typography>
        <Typography className="text-gray-600 mb-2">
          {text.message}
        </Typography>
        <Typography className="text-gray-500 text-sm mb-6">
          {text.orderDetails}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          className="bg-habesha_yellow hover:bg-yellow-500 text-habesha_blue font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto"
        >
          <ShoppingBagIcon />
          {text.continueShopping}
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;