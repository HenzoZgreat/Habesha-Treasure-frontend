import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Typography, CircularProgress, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const translations = {
  EN: {
    verifying: 'Verifying payment...',
    transactionDetails: 'Transaction Details',
    amount: 'Amount',
    currency: 'Currency',
    paymentMethod: 'Payment Method',
    status: 'Status',
    reference: 'Reference',
    error: 'Payment verification failed',
    noTxRef: 'Transaction reference not found',
    noToken: 'Authentication token not found',
  },
  AMH: {
    verifying: 'ክፍያ በመፈተሽ ላይ...',
    transactionDetails: 'የግብይት ዝርዝሮች',
    amount: 'መጠን',
    currency: 'የገንዘብ አይነት',
    paymentMethod: 'የክፍያ ዘዴ',
    status: 'ሁኔታ',
    reference: 'ማጣቀሻ',
    error: 'የክፍያ ማረጋገጫ አልተሳካም',
    noTxRef: 'የግብይት ማጣቀሻ አልተገኘም',
    noToken: 'የማረጋገጫ ቶከን አልተገኘም',
  },
};

const PaymentVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const language = localStorage.getItem('language') || 'EN';
  const text = translations[language];

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const txRef = params.get('tx_ref');
      if (!txRef) {
        setError(text.noTxRef);
        setTimeout(() => navigate('/payment/error'), 5000);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError(text.noToken);
          setTimeout(() => navigate('/SignIn'), 5000);
          return;
        }
        console.log('Sending verify request with tx_ref:', txRef, 'and token:', token);
        const response = await axios.post(
          'http://localhost:8080/api/payments/verify',
          { tx_ref: txRef },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Verify response:', response.data);

        if (response.data.status === 'success') {
          setTransactionDetails({
            amount: response.data.data?.amount || 'N/A',
            currency: response.data.data?.currency || 'N/A',
            paymentMethod: response.data.data?.method || 'N/A',
            status: response.data.data?.status || 'success',
            reference: response.data.data?.reference || 'N/A',
          });
          setTimeout(() => navigate('/payment/success'), 5000);
        } else {
          setError(text.error);
          setTransactionDetails({
            amount: response.data.data?.amount || 'N/A',
            currency: response.data.data?.currency || 'N/A',
            paymentMethod: response.data.data?.method || 'N/A',
            status: response.data.data?.status || 'failed',
            reference: response.data.data?.reference || 'N/A',
          });
          setTimeout(() => navigate('/payment/error'), 5000);
        }
      } catch (err) {
        console.error('Verify error:', err.response?.data || err.message);
        setError(text.error);
        setTimeout(() => navigate('/payment/error'), 5000);
      }
    };
    verifyPayment();
  }, [navigate, location, text]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {error && (
          <ErrorIcon className="text-red-500 text-6xl mb-4" />
        )}
        {!error && transactionDetails && (
          <CheckCircleIcon className="text-green-500 text-6xl mb-4" />
        )}
        <Typography variant="h5" className="text-habesha_blue font-medium mb-4">
          {error || !transactionDetails ? text.verifying : text.transactionDetails}
        </Typography>
        {error && (
          <Typography color="error" className="mb-4">
            {error}
          </Typography>
        )}
        {!error && !transactionDetails && (
          <Box>
            <CircularProgress style={{ color: '#1E88E5' }} />
            <Typography className="mt-4">{text.verifying}</Typography>
          </Box>
        )}
        {transactionDetails && (
          <Box className="bg-white rounded-lg shadow-sm p-4 text-left">
            <Typography className="text-gray-600 mb-2">
              <strong>{text.amount}:</strong> {transactionDetails.amount} {transactionDetails.currency}
            </Typography>
            <Typography className="text-gray-600 mb-2">
              <strong>{text.currency}:</strong> {transactionDetails.currency}
            </Typography>
            <Typography className="text-gray-600 mb-2">
              <strong>{text.paymentMethod}:</strong> {transactionDetails.paymentMethod}
            </Typography>
            <Typography className="text-gray-600 mb-2">
              <strong>{text.status}:</strong> {transactionDetails.status}
            </Typography>
            <Typography className="text-gray-600">
              <strong>{text.reference}:</strong> {transactionDetails.reference}
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;