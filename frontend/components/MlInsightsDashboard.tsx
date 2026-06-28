'use client';

import { useState } from 'react';
import { apiRequest } from '../lib/api';
import { formatMoney } from '../lib/format';

type MlInsightsDashboardProps = {
  token: string;
};

export function MlInsightsDashboard({ token }: MlInsightsDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadInsights() {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const result = await apiRequest('/ml-insights/business-insights', {}, token);
      setData(result);
      setMessage('ML insights loaded successfully');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load ML insights. Make sure ML service is running on port 8000.',
      );
    } finally {
      setLoading(false);
    }
  }

  const insights = data?.insights;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <h3 className="text-lg font-bold text-white">Data Science / ML Insights</h3>
        <p className="mt-2 text-sm text-slate-400">
          Analyze sales, inventory, demand, low-stock risk, and sales anomalies using the Python ML service.
        </p>

        <button
          onClick={loadInsights}
          disabled={loading}
          className="mt-5 rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:bg-slate-600"
        >
          {loading ? 'Loading ML insights...' : 'Load ML Insights'}
        </button>

        {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>

      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-950 p-5">
            <p className="text-sm text-slate-400">Products Analyzed</p>
            <p className="mt-2 text-3xl font-bold text-cyan-300">
              {data.productsAnalyzed}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-5">
            <p className="text-sm text-slate-400">Sales Records Analyzed</p>
            <p className="mt-2 text-3xl font-bold text-cyan-300">
              {data.salesRecordsAnalyzed}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-5">
            <p className="text-sm text-slate-400">ML Service</p>
            <p className="mt-2 text-sm font-bold text-emerald-300">
              {data.source}
            </p>
          </div>
        </div>
      )}

      {insights && (
        <>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="mb-4 text-lg font-bold text-white">Sales Forecast - Next 7 Days</h3>

            {insights.salesForecastNext7Days?.length === 0 ? (
              <p className="text-sm text-slate-400">Not enough sales data for forecasting.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Predicted Revenue</th>
                      <th className="pb-3">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {insights.salesForecastNext7Days?.map((item: any) => (
                      <tr key={item.date}>
                        <td className="py-3 text-white">{item.date}</td>
                        <td className="py-3 font-bold text-cyan-300">
                          {formatMoney(item.predictedRevenueCents)}
                        </td>
                        <td className="py-3 text-slate-300">{item.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <h3 className="mb-4 text-lg font-bold text-white">Best-Selling Products</h3>

              {insights.bestSellingProducts?.length === 0 ? (
                <p className="text-sm text-slate-400">No product sales data found.</p>
              ) : (
                <div className="space-y-3">
                  {insights.bestSellingProducts?.map((product: any) => (
                    <div
                      key={product.productId}
                      className="rounded-xl bg-slate-900 p-4"
                    >
                      <p className="font-bold text-white">{product.productName}</p>
                      <p className="text-sm text-slate-400">
                        Quantity sold: {product.totalQuantitySold}
                      </p>
                      <p className="text-sm text-cyan-300">
                        Revenue: {formatMoney(product.totalRevenueCents)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <h3 className="mb-4 text-lg font-bold text-white">Slow-Moving Products</h3>

              {insights.slowMovingProducts?.length === 0 ? (
                <p className="text-sm text-slate-400">No product sales data found.</p>
              ) : (
                <div className="space-y-3">
                  {insights.slowMovingProducts?.map((product: any) => (
                    <div
                      key={product.productId}
                      className="rounded-xl bg-slate-900 p-4"
                    >
                      <p className="font-bold text-white">{product.productName}</p>
                      <p className="text-sm text-slate-400">
                        Quantity sold: {product.totalQuantitySold}
                      </p>
                      <p className="text-sm text-cyan-300">
                        Revenue: {formatMoney(product.totalRevenueCents)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="mb-4 text-lg font-bold text-white">Low-Stock Risk Prediction</h3>

            {insights.lowStockRisk?.length === 0 ? (
              <p className="text-sm text-slate-400">No product stock data found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3">Reorder Level</th>
                      <th className="pb-3">Avg Daily Demand</th>
                      <th className="pb-3">Days Remaining</th>
                      <th className="pb-3">Risk</th>
                      <th className="pb-3">Suggestion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {insights.lowStockRisk?.map((item: any) => (
                      <tr key={item.productId}>
                        <td className="py-3 font-medium text-white">{item.productName}</td>
                        <td className="py-3 text-slate-300">{item.stockQuantity}</td>
                        <td className="py-3 text-slate-300">{item.reorderLevel}</td>
                        <td className="py-3 text-slate-300">{item.averageDailyDemand}</td>
                        <td className="py-3 text-slate-300">
                          {item.estimatedDaysRemaining ?? 'N/A'}
                        </td>
                        <td className="py-3">
                          <span
                            className={
                              item.riskLevel === 'HIGH'
                                ? 'rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300 ring-1 ring-red-500/30'
                                : 'rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30'
                            }
                          >
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">{item.suggestion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="mb-4 text-lg font-bold text-white">Sales Anomaly Detection</h3>

            {insights.salesAnomalies?.length === 0 ? (
              <p className="text-sm text-slate-400">
                No unusual sales activity detected.
              </p>
            ) : (
              <div className="space-y-3">
                {insights.salesAnomalies?.map((anomaly: any, index: number) => (
                  <div key={index} className="rounded-xl bg-red-500/10 p-4 ring-1 ring-red-500/30">
                    <p className="font-bold text-red-300">{anomaly.productName}</p>
                    <p className="text-sm text-slate-300">
                      Quantity: {anomaly.quantity}
                    </p>
                    <p className="text-sm text-slate-300">
                      Amount: {formatMoney(anomaly.totalAmountCents)}
                    </p>
                    <p className="text-sm text-slate-400">{anomaly.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
