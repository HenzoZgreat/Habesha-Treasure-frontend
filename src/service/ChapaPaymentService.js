import api from '../componets/api/api';

const API_URL = '/payments';

const initiateChapa = async (email, firstName, lastName, phoneNumber, amount) => {
  const token = localStorage.getItem('token');
  return api.post(
    `${API_URL}/initiate-chapa`,
    null,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        email,
        firstName,
        lastName,
        phoneNumber: phoneNumber || "",
        amount,
      },
    }
  );
};

const verifyPayment = async (tx_ref) => {
  const token = localStorage.getItem('token');
  return api.post(
    `${API_URL}/verify`,
    { tx_ref },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const verifyTelebirrPayment = async (transactionId) => {
  const token = localStorage.getItem('token');
  return api.post(
    `${API_URL}/verify-telebirr`,
    { transactionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

const ChapaPaymentService = {
  initiateChapa,
  verifyPayment,
  verifyTelebirrPayment,
};

export default ChapaPaymentService;