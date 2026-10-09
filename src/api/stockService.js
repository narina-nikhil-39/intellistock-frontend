import apiClient from './client';

export const getProducts = () => apiClient.get('/products');
export const createProduct = (productData) => apiClient.post('/products', productData);
export const markProductEOL = (id) => apiClient.patch(`/products/${id}/eol`);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);

export const getTransactions = () => apiClient.get('/transactions');
export const recordTransaction = (transactionData) => apiClient.post('/transactions', transactionData);