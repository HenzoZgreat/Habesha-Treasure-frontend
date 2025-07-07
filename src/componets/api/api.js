import axios from "axios";

// export async function productsData(){
//     const products = await axios.get(
//       "https://fakestoreapi.com/products"
//     );
//     return products
// }

const api = axios.create({
  baseURL: 'https://habeshatreasure-backend-production.up.railway.app/api', // Change to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;