import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AnalyticsDashboard({ products = [], transactions = [] }) {
  const movementTrendData = useMemo(() => {
    const dateMap = {};

    transactions.forEach((tx) => {
      const rawDate = tx.createdAt ? tx.createdAt.split('T')[0] : (tx.billDate || 'Unknown');
      if (!dateMap[rawDate]) {
        dateMap[rawDate] = { date: rawDate, inward: 0, outward: 0 };
      }
      if (tx.type === 'INWARD') {
        dateMap[rawDate].inward += tx.quantity;
      } else if (tx.type === 'OUTWARD') {
        dateMap[rawDate].outward += tx.quantity;
      }
    });

    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const catMap = {};

    products.forEach((p) => {
      const category = p.category && p.category.trim() !== '' ? p.category : 'Unassigned';
      catMap[category] = (catMap[category] || 0) + (p.currentStock || 0);
    });

    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [products]);

  const totalStockUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.currentStock || 0), 0);
  }, [products]);

  const totalInwardUnits = useMemo(() => {
    return transactions.filter((t) => t.type === 'INWARD').reduce((acc, t) => acc + t.quantity, 0);
  }, [transactions]);

  const totalOutwardUnits = useMemo(() => {
    return transactions.filter((t) => t.type === 'OUTWARD').reduce((acc, t) => acc + t.quantity, 0);
  }, [transactions]);

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={kpiGridStyle}>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Total Stock on Hand</div>
          <div style={kpiValueStyle}>{totalStockUnits} <span style={kpiUnitStyle}>units</span></div>
        </div>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Total Units Received (Inward)</div>
          <div style={{ ...kpiValueStyle, color: '#16a34a' }}>+{totalInwardUnits}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Total Units Dispatched (Outward)</div>
          <div style={{ ...kpiValueStyle, color: '#dc2626' }}>-{totalOutwardUnits}</div>
        </div>
        <div style={kpiCardStyle}>
          <div style={kpiLabelStyle}>Catalog SKUs</div>
          <div style={kpiValueStyle}>{products.length}</div>
        </div>
      </div>

      <div style={chartsGridStyle}>
        <div style={chartCardStyle}>
          <h4 style={chartTitleStyle}>Stock Movement Velocity (Inflow vs Outflow)</h4>
          <div style={{ height: '280px', width: '100%' }}>
            {movementTrendData.length === 0 ? (
              <div style={emptyChartStyle}>No movement data available to chart.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={movementTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="inward" name="Inward (Restock)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outward" name="Outward (Dispatched)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={chartCardStyle}>
          <h4 style={chartTitleStyle}>Inventory Distribution by Category</h4>
          <div style={{ height: '280px', width: '100%' }}>
            {categoryData.length === 0 ? (
              <div style={emptyChartStyle}>No catalog items available.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const kpiGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  marginBottom: '20px'
};

const kpiCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px 20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
};

const kpiLabelStyle = {
  fontSize: '13px',
  color: '#64748b',
  fontWeight: '500',
  marginBottom: '6px'
};

const kpiValueStyle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#0f172a'
};

const kpiUnitStyle = {
  fontSize: '14px',
  fontWeight: '400',
  color: '#94a3b8'
};

const chartsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
  gap: '20px'
};

const chartCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
};

const chartTitleStyle = {
  margin: '0 0 16px',
  fontSize: '15px',
  fontWeight: '600',
  color: '#1e293b'
};

const emptyChartStyle = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#94a3b8',
  fontSize: '13px'
};
