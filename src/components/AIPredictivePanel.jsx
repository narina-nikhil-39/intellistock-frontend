import React from 'react';

export default function AIPredictivePanel({ forecasts = [], onQuickRestock }) {
  if (!forecasts || forecasts.length === 0) return null;

  const criticalItems = forecasts.filter((f) => f.restockUrgency === 'CRITICAL');
  const warningItems = forecasts.filter((f) => f.restockUrgency === 'WARNING');

  return (
    <div style={panelCardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <span>🧠</span> AI Demand Forecasting &amp; Burn Rates
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Predictive stockout estimates based on historical dispatch velocity
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {criticalItems.length > 0 && (
            <span style={urgencyChip('#fee2e2', '#991b1b')}>
              🚨 {criticalItems.length} Critical Stockout Risk
            </span>
          )}
          {warningItems.length > 0 && (
            <span style={urgencyChip('#fef3c7', '#92400e')}>
              ⚠️ {warningItems.length} Needs Attention
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
        {forecasts.map((item) => {
          const isCritical = item.restockUrgency === 'CRITICAL';
          const isWarning = item.restockUrgency === 'WARNING';
          const borderColor = isCritical ? '#fca5a5' : isWarning ? '#fde68a' : '#e2e8f0';
          const bgColor = isCritical ? '#fff5f5' : isWarning ? '#fffbeb' : '#ffffff';

          return (
            <div key={item.productId} style={{ ...forecastCardStyle, borderColor, backgroundColor: bgColor }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b' }}>{item.productName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{item.sku}</div>
                </div>
                <span style={statusBadge(item.restockUrgency)}>{item.restockUrgency}</span>
              </div>

              <div style={{ margin: '14px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={metricRowStyle}>
                  <span style={{ color: '#64748b' }}>Daily Burn Rate:</span>
                  <strong>{item.dailyBurnRate > 0 ? `${item.dailyBurnRate} units/day` : 'No dispatch data'}</strong>
                </div>
                <div style={metricRowStyle}>
                  <span style={{ color: '#64748b' }}>Est. Days Left:</span>
                  <strong>
                    {item.estimatedDaysRemaining !== null ? (
                      <span style={{ color: isCritical ? '#dc2626' : isWarning ? '#d97706' : '#16a34a' }}>
                        {item.estimatedDaysRemaining} days
                      </span>
                    ) : (
                      'Stable'
                    )}
                  </strong>
                </div>
                {item.projectedStockoutDate && (
                  <div style={metricRowStyle}>
                    <span style={{ color: '#64748b' }}>Projected Stockout:</span>
                    <strong>{item.projectedStockoutDate}</strong>
                  </div>
                )}
              </div>

              {item.recommendedRestockQuantity > 0 && (
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>
                    Rec. Restock: +{item.recommendedRestockQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuickRestock && onQuickRestock({
                      id: item.productId,
                      recommendedReorderQuantity: item.recommendedRestockQuantity,
                    })}
                    style={restockBtnStyle}
                  >
                    ⚡ Auto-Restock
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const panelCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const forecastCardStyle = {
  border: '1px solid',
  borderRadius: '6px',
  padding: '14px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};

const metricRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
};

const urgencyChip = (bg, color) => ({
  backgroundColor: bg,
  color,
  padding: '4px 10px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '600',
});

const statusBadge = (urgency) => {
  let bg = '#f1f5f9';
  let color = '#475569';

  if (urgency === 'CRITICAL') {
    bg = '#fee2e2';
    color = '#b91c1c';
  } else if (urgency === 'WARNING') {
    bg = '#fef3c7';
    color = '#b45309';
  } else if (urgency === 'STABLE') {
    bg = '#dcfce7';
    color = '#15803d';
  }

  return {
    backgroundColor: bg,
    color,
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '700',
  };
};

const restockBtnStyle = {
  backgroundColor: '#16a34a',
  color: '#ffffff',
  border: 'none',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '600',
  cursor: 'pointer',
};
