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
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 style={{ marginTop: 0 }}>Add New Product</h3>
        {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="SKU (e.g. SKU-101)"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
            className="modal-input"
          />
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="modal-input"
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="modal-input"
          />
          <input
            type="number"
            placeholder="Initial Stock"
            value={form.initialStock}
            onChange={(e) => setForm({ ...form, initialStock: e.target.value })}
            required
            min="0"
            className="modal-input"
          />
          <input
            type="number"
            placeholder="Safety Stock Level"
            value={form.safetyStockLevel}
            onChange={(e) => setForm({ ...form, safetyStockLevel: e.target.value })}
            required
            min="0"
            className="modal-input"
          />
          <div className="modal-actions">
            <button type="submit" style={btnPrimary}>Save Product</button>
            <button type="button" onClick={onClose} className="modal-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const btnPrimary = { flex: 1, background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };