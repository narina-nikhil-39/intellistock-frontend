import apiClient from './client';

export const getProducts = () => apiClient.get('/products');
export const getLowStockProducts = () => apiClient.get('/products/low-stock');
export const createProduct = (productData) => apiClient.post('/products', productData);
export const markProductEOL = (id) => apiClient.patch(`/products/${id}/eol`);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

export const getTransactions = () => apiClient.get('/transactions');
export const recordTransaction = (transactionData) => apiClient.post('/transactions', transactionData);

export const getDemandForecasts = () => apiClient.get('/forecast');
export const getProductForecast = (productId) => apiClient.get(`/forecast/product/${productId}`);