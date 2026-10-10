import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIPredictivePanel from './AIPredictivePanel';

describe('AIPredictivePanel', () => {
  const mockForecasts = [
    {
      productId: 1,
      sku: 'SAM-M45',
      productName: 'Samsung M45',
      currentStock: 7,
      dailyBurnRate: 14.5,
      estimatedDaysRemaining: 0,
      projectedStockoutDate: '2026-10-10',
      restockUrgency: 'CRITICAL',
      recommendedRestockQuantity: 25
    }
  ];

  it('renders predictive forecast metrics correctly', () => {
    render(<AIPredictivePanel forecasts={mockForecasts} onQuickRestock={vi.fn()} />);

    expect(screen.getByText('Samsung M45')).toBeInTheDocument();
    expect(screen.getByText('SAM-M45')).toBeInTheDocument();
    expect(screen.getByText('14.5 units/day')).toBeInTheDocument();
    expect(screen.getByText('0 days')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  });

  it('calls onQuickRestock handler when Auto-Restock button is clicked', () => {
    const mockRestockFn = vi.fn();
    render(<AIPredictivePanel forecasts={mockForecasts} onQuickRestock={mockRestockFn} />);

    const restockButton = screen.getByText('⚡ Auto-Restock');
    fireEvent.click(restockButton);

    expect(mockRestockFn).toHaveBeenCalledTimes(1);
    expect(mockRestockFn).toHaveBeenCalledWith({
      id: 1,
      recommendedReorderQuantity: 25
    });
  });
});
