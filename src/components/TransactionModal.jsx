import React, { useState } from 'react';

export default function TransactionModal({ isOpen, onClose, products, onTransactionRecorded }) {
  const [form, setForm] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      productId: '',
      type: 'INWARD',
      quantity: '',
      billDate: today,
      deliveryDate: today,
    };
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
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 style={{ marginTop: 0 }}>Record Stock Movement</h3>
        {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            required
            className="modal-input"
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
            className="modal-input"
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
            className="modal-input"
          />
          <input
            type="date"
            value={form.billDate}
            onChange={(e) => setForm({ ...form, billDate: e.target.value })}
            className="modal-input"
          />
          <input
            type="date"
            value={form.deliveryDate}
            onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
            className="modal-input"
          />

          <div className="modal-actions">
            <button type="submit" style={btnPrimary}>Submit Transaction</button>
            <button type="button" onClick={onClose} className="modal-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const btnPrimary = { flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };