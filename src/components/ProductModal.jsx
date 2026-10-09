import React, { useState } from 'react';

export default function ProductModal({ isOpen, onClose, onProductCreated }) {
  const [form, setForm] = useState({
    sku: '',
    name: '',
    category: '',
    initialStock: '',
    safetyStockLevel: '',
  });
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onProductCreated({
        ...form,
        initialStock: parseInt(form.initialStock, 10),
        safetyStockLevel: parseInt(form.safetyStockLevel, 10),
      });
      setForm({ sku: '', name: '', category: '', initialStock: '', safetyStockLevel: '' });
      setError(null);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={modalCardStyle}>
        <h3 style={{ marginTop: 0 }}>Add New Product</h3>
        {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="SKU (e.g. SKU-101)"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Initial Stock"
            value={form.initialStock}
            onChange={(e) => setForm({ ...form, initialStock: e.target.value })}
            required
            min="0"
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Safety Stock Level"
            value={form.safetyStockLevel}
            onChange={(e) => setForm({ ...form, safetyStockLevel: e.target.value })}
            required
            min="0"
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="submit" style={btnPrimary}>Save Product</button>
            <button type="button" onClick={onClose} style={btnSecondary}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const modalCardStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '380px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '10px', margin: '6px 0', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' };
const btnPrimary = { flex: 1, background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const btnSecondary = { flex: 1, background: '#e5e7eb', color: '#374151', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' };