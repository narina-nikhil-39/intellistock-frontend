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
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('intellistock-theme') === 'dark' ? 'dark' : 'light');
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

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('intellistock-theme', nextTheme);
    setTheme(nextTheme);
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
    return (
      <div className="app-shell" data-theme={theme}>
        <ThemeToggle theme={theme} onToggle={toggleTheme} floating />
        <AuthModal onLoginSuccess={checkUserSession} />
      </div>
    );
  }

  const isAdmin = user.role === 'ROLE_ADMIN';

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="app-content">
      <header className="app-header">
        <div>
          <h1 className="app-title">IntelliStock</h1>
          <p className="user-summary">
            User: <strong>{user.username}</strong> | Access Level: <strong className={isAdmin ? 'role-admin' : 'role-staff'}>{isAdmin ? 'ADMINISTRATOR' : 'STAFF'}</strong>
          </p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <>
              <button onClick={() => setProductModalOpen(true)} className="action-btn action-btn--secondary">
                + Add Product
              </button>
              <button onClick={() => setAdminModalOpen(true)} className="action-btn action-btn--secondary">
                + Add Admin
              </button>
            </>
          )}
          <button onClick={() => setTxModalOpen(true)} className="action-btn action-btn--primary">
            + Record Movement
          </button>
          <button onClick={handleLogout} className="action-btn action-btn--ghost">
            Logout
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Stock Monitor Table */}
      <div className="inventory-card">
        <h3>Current Inventory Status</h3>
        <div className="table-scroll">
        <table className="inventory-table">
          <thead>
            <tr>
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
              <tr><td colSpan={isAdmin ? "7" : "6"} className="empty-state">No products recorded.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
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
      </div>

      {/* Transaction Ledger Table */}
      <div className="inventory-card">
        <h3>Transaction Ledger</h3>
        <div className="table-scroll">
        <table className="inventory-table">
          <thead>
            <tr>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Product</th>
              <th style={cellStyle}>Type</th>
              <th style={cellStyle}>Quantity</th>
              <th style={cellStyle}>Integrity Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">No transaction history found.</td></tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id}>
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
                      <span className="status-verified">Verified</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
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
    </div>
  );
}

function ThemeToggle({ theme, onToggle, floating = false }) {
  const nextTheme = theme === 'light' ? 'dark' : 'light';
  return (
    <button
      type="button"
      className={`theme-toggle${floating ? ' theme-toggle--floating' : ''}`}
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'dark'}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === 'light' ? '☾' : '☀'} {theme === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  );
}

const cellStyle = { padding: '12px 14px' };
const badgeStyle = (bg, color) => ({ backgroundColor: bg, color: color, padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' });