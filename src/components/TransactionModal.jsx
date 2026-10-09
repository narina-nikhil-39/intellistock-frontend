import React, { useState } from 'react';

export default function TransactionModal({ isOpen, onClose, products, onTransactionRecorded }) {
  const [form, setForm] = useState({
    productId: '',
    type: 'INWARD',
    quantity: '',
    billDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onTransactionRecorded({
        productId: parseInt(form.productId, 10),
        type: form.type,
        quantity: parseInt(form.quantity, 10),
        billDate: form.billDate,
        deliveryDate: form.deliveryDate,
      });
      setError(null);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction recording failed');
    }
  };

  return (
    <div style={backdropStyle}>
      <div style={modalCardStyle}>
        <h3 style={{ marginTop: 0 }}>Record Stock Movement</h3>
        {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            required
            style={inputStyle}
          >
            <option value="">-- Select Product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) | Stock: {p.currentStock}
              </option>
            ))}
          </select>

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            style={inputStyle}
          >
            <option value="INWARD">Inward (Add to Stock)</option>
            <option value="OUTWARD">Outward (Dispatch / Consume)</option>
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
            min="1"
            style={inputStyle}
          />
          <input
            type="date"
            value={form.billDate}
            onChange={(e) => setForm({ ...form, billDate: e.target.value })}
            style={inputStyle}
          />
          <input
            type="date"
            value={form.deliveryDate}
            onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
            style={inputStyle}
          />

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="submit" style={btnPrimary}>Submit Transaction</button>
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
const btnPrimary = { flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const btnSecondary = { flex: 1, background: '#e5e7eb', color: '#374151', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' };