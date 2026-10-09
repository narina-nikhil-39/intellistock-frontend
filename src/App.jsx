import React, { useState, useEffect } from 'react';
import { 
  getProducts, 
  getTransactions, 
  createProduct, 
  markProductEOL, 
  deleteProduct, 
  recordTransaction 
} from './api/stockService';
import ProductModal from './components/ProductModal';
import TransactionModal from './components/TransactionModal';
import AuthModal from './components/AuthModal';
import AdminCreateModal from './components/AdminCreateModal';

export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [isTxModalOpen, setTxModalOpen] = useState(false);
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);

  const checkUserSession = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUserSession();
    window.addEventListener('auth-changed', checkUserSession);
    return () => window.removeEventListener('auth-changed', checkUserSession);
  }, []);

  const refreshData = async () => {
    try {
      const [prodRes, txRes] = await Promise.all([getProducts(), getTransactions()]);
      setProducts(prodRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleCreateProduct = async (data) => {
    await createProduct(data);
    refreshData();
  };

  const handleMarkEOL = async (id) => {
    if (window.confirm("Move this product to End of Life?")) {
      try {
        await markProductEOL(id);
        refreshData();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to mark product as End of Life");
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        refreshData();
      } catch (err) {
        alert(err.response?.data?.message || "Permission Denied: Admin role required.");
      }
    }
  };

  const handleRecordTransaction = async (data) => {
    await recordTransaction(data);
    refreshData();
  };

  if (!user) {
    return <AuthModal onLoginSuccess={checkUserSession} />;
  }

  const isAdmin = user.role === 'ROLE_ADMIN';

  return (
    <div style={{ padding: '32px', fontFamily: 'system-ui, sans-serif', maxWidth: '1150px', margin: '0 auto', color: '#111827' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>IntelliStock</h1>
          <p style={{ margin: '4px 0 0', color: '#6b7280' }}>
            User: <strong>{user.username}</strong> | Access Level: <strong style={{ color: isAdmin ? '#2563eb' : '#059669' }}>{isAdmin ? 'ADMINISTRATOR' : 'STAFF'}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin && (
            <>
              <button onClick={() => setProductModalOpen(true)} style={actionBtn('#2563eb')}>
                + Add Product
              </button>
              <button onClick={() => setAdminModalOpen(true)} style={actionBtn('#4f46e5')}>
                + Add Admin
              </button>
            </>
          )}
          <button onClick={() => setTxModalOpen(true)} style={actionBtn('#16a34a')}>
            + Record Movement
          </button>
          <button onClick={handleLogout} style={actionBtn('#6b7280')}>
            Logout
          </button>
        </div>
      </header>

      {/* Stock Monitor Table */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px' }}>Current Inventory Status</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
              <th style={cellStyle}>SKU</th>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Category</th>
              <th style={cellStyle}>Current Stock</th>
              <th style={cellStyle}>Safety Level</th>
              <th style={cellStyle}>Status</th>
              {isAdmin && <th style={cellStyle}>Admin Controls</th>}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={isAdmin ? "7" : "6"} style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No products recorded.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={cellStyle}><code>{p.sku}</code></td>
                  <td style={cellStyle}>{p.name}</td>
                  <td style={cellStyle}>
                    {p.category === 'End of Life' ? (
                      <span style={badgeStyle('#fef3c7', '#b45309')}>End of Life</span>
                    ) : (
                      p.category || '-'
                    )}
                  </td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{p.currentStock}</td>
                  <td style={cellStyle}>{p.safetyStockLevel}</td>
                  <td style={cellStyle}>
                    {p.isReorderRecommended ? (
                      <span style={badgeStyle('#fee2e2', '#b91c1c')}>⚠️ Reorder Needed</span>
                    ) : (
                      <span style={badgeStyle('#dcfce7', '#15803d')}>Optimal</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {p.category !== 'End of Life' && (
                          <button
                            onClick={() => handleMarkEOL(p.id)}
                            style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Mark EOL
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Ledger Table */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px' }}>Transaction Ledger</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Product</th>
              <th style={cellStyle}>Type</th>
              <th style={cellStyle}>Quantity</th>
              <th style={cellStyle}>Integrity Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#9ca3af' }}>No transaction history found.</td></tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={cellStyle}>#{tx.id}</td>
                  <td style={cellStyle}>{tx.productName} ({tx.productSku})</td>
                  <td style={cellStyle}>
                    <span style={badgeStyle(tx.type === 'INWARD' ? '#dbeafe' : '#ffedd5', tx.type === 'INWARD' ? '#1e40af' : '#9a3412')}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{tx.quantity}</td>
                  <td style={cellStyle}>
                    {tx.isAnomaly ? (
                      <span style={badgeStyle('#fef08a', '#854d0e')}>🚨 Unusual Spike</span>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '13px' }}>Verified</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setProductModalOpen(false)}
        onProductCreated={handleCreateProduct}
      />
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setTxModalOpen(false)}
        products={products}
        onTransactionRecorded={handleRecordTransaction}
      />
      <AdminCreateModal
        isOpen={isAdminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </div>
  );
}

const cardStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const cellStyle = { padding: '12px 14px' };
const actionBtn = (bg) => ({ background: bg, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' });
const badgeStyle = (bg, color) => ({ backgroundColor: bg, color: color, padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' });