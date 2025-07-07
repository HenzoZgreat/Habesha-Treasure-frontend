import api from '../componets/api/api'; // Assuming api.js handles Authorization

// Use actual API base URL
const API_URL = '/admin/products';
const USE_MOCK_API = false;

const initialMockProducts = [
  { id: 1, name: 'Elegant Habesha Dress', image: 'https://via.placeholder.com/80x100/A9CCE3/2C3E50?text=HD1', category: 'Traditional Wear', price: 125.00, stock: 25, status: 'Active', dateAdded: '2025-06-13', descriptionEn: 'A beautifully embroidered traditional Habesha dress.', descriptionAm: 'የቆንጆ ሐበሻ የባህል የሴት አልባሳት ከጌጣጌጦች ጋር።', favorites: 0, isFeatured: true },
  // ... other mock products
];

let mockProductsStore = [...initialMockProducts];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getProducts = async (params = {}) => {
  const token = localStorage.getItem('token');
  return api.get(API_URL, { params, headers: { Authorization: `Bearer ${token}` } });
};

const addProduct = async (productData) => {
  if (USE_MOCK_API) {
    await delay(300);
    const newProduct = { 
      ...productData, 
      id: Date.now(), 
      dateAdded: new Date().toISOString().split('T')[0],
      image: productData.image || 'https://via.placeholder.com/80x100/CCCCCC/FFFFFF?text=New',
      favorites: 0,
      isFeatured: productData.isFeatured || false
    };
    mockProductsStore = [newProduct, ...mockProductsStore];
    return { data: newProduct };
  }
  const token = localStorage.getItem('token');
  const response = await api.post(API_URL, productData, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } }; // Wrap text response
};

const updateProduct = async (id, productData) => {
  if (USE_MOCK_API) {
    await delay(300);
    mockProductsStore = mockProductsStore.map(p => p.id === id ? { ...p, ...productData } : p);
    const updatedProduct = mockProductsStore.find(p => p.id === id);
    return { data: updatedProduct };
  }
  const token = localStorage.getItem('token');
  return api.put(`${API_URL}/${id}`, productData, { headers: { Authorization: `Bearer ${token}` } });
};

const deleteProduct = async (id) => {
  if (USE_MOCK_API) {
    await delay(300);
    mockProductsStore = mockProductsStore.filter(p => p.id !== id);
    return { data: { message: 'Product deleted successfully' } };
  }
  const token = localStorage.getItem('token');
  const response = await api.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } }; // Wrap text response
};

const deleteMultipleProducts = async (ids) => {
  if (USE_MOCK_API) {
    await delay(500);
    mockProductsStore = mockProductsStore.filter(p => !ids.includes(p.id));
    return { data: { message: `${ids.length} products deleted successfully` } };
  }
  const token = localStorage.getItem('token');
  const response = await api.post(`${API_URL}/bulk-delete`, { ids }, { headers: { Authorization: `Bearer ${token}` } });
  return { data: { message: response.data } }; // Wrap text response
};

const getUniqueCategories = async () => {
  const token = localStorage.getItem('token');
  try {
    return await api.get(`${API_URL}/distinct/categories`, { headers: { Authorization: `Bearer ${token}` } });
  } catch {
    return { data: [] }; // Fallback to empty array on error
  }
};

const getUniqueStatuses = async () => {
  if (USE_MOCK_API) {
    await delay(100);
    const statuses = [...new Set(mockProductsStore.map(p => p.status))].sort();
    return { data: statuses };
  }
  const token = localStorage.getItem('token');
  try {
    return await api.get(`${API_URL}/distinct/statuses`, { headers: { Authorization: `Bearer ${token}` } });
  } catch {
    return { data: [...new Set(mockProductsStore.map(p => p.status))].sort() };
  }
};

const productService = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  getUniqueCategories,
  getUniqueStatuses,
  initialMockProducts
};

export default productService;