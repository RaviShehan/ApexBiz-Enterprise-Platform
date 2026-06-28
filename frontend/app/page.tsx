'use client';

import { useState, type FormEvent } from 'react';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { apiRequest } from '../lib/api';
import { formatMoney } from '../lib/format';

type UserData = {
  id: string;
  username: string;
  role: string;
  status: string;
};

type DashboardData = {
  businesses: any[];
  branches: any[];
  wallets: any[];
  products: any[];
  posSales: any[];
  inventoryMovements: any[];
  trialBalance: any;
  incomeStatement: any;
  balanceSheet: any;
  walletSummary: any;
  ledgerSummary: any;
};

type ActiveSection = 'overview' | 'products' | 'pos' | 'inventory' | 'accounting';

export default function Home() {
  const [username, setUsername] = useState('rbacadmin');
  const [password, setPassword] = useState('admin123');
  const [token, setToken] = useState('');
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadDashboardData(accessToken: string) {
    const [
      businesses,
      branches,
      wallets,
      products,
      posSales,
      inventoryMovements,
      trialBalance,
      incomeStatement,
      balanceSheet,
      walletSummary,
      ledgerSummary,
    ] = await Promise.all([
      apiRequest('/businesses', {}, accessToken),
      apiRequest('/branches', {}, accessToken),
      apiRequest('/wallets', {}, accessToken),
      apiRequest('/products', {}, accessToken),
      apiRequest('/pos-sales', {}, accessToken),
      apiRequest('/inventory/movements', {}, accessToken),
      apiRequest('/accounting/trial-balance', {}, accessToken),
      apiRequest('/accounting/income-statement', {}, accessToken),
      apiRequest('/accounting/balance-sheet', {}, accessToken),
      apiRequest('/accounting/wallet-summary', {}, accessToken),
      apiRequest('/accounting/ledger-summary', {}, accessToken),
    ]);

    setDashboardData({
      businesses,
      branches,
      wallets,
      products,
      posSales,
      inventoryMovements,
      trialBalance,
      incomeStatement,
      balanceSheet,
      walletSummary,
      ledgerSummary,
    });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginResponse = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      const accessToken = loginResponse.accessToken;
      setToken(accessToken);

      const meResponse = await apiRequest('/auth/me', {}, accessToken);
      setUser(meResponse.user);

      await loadDashboardData(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setToken('');
      setUser(null);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    setUser(null);
    setDashboardData(null);
    setActiveSection('overview');
    setError('');
  }

  function navButton(label: string, section: ActiveSection) {
    const isActive = activeSection === section;

    return (
      <button
        onClick={() => setActiveSection(section)}
        className={`rounded-xl px-4 py-2 text-sm font-semibold ${
          isActive
            ? 'bg-cyan-500 text-slate-950'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        {label}
      </button>
    );
  }

  if (user && dashboardData) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                ApexBiz
              </p>
              <h1 className="text-2xl font-bold">Enterprise Dashboard</h1>
            </div>

            <div className="text-right">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-slate-400">{user.role}</p>
              <button
                onClick={handleLogout}
                className="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex flex-wrap gap-3">
            {navButton('Overview', 'overview')}
            {navButton('Products', 'products')}
            {navButton('POS Sales', 'pos')}
            {navButton('Inventory', 'inventory')}
            {navButton('Accounting', 'accounting')}
          </div>

          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Businesses" value={dashboardData.businesses.length} />
                <StatCard title="Branches" value={dashboardData.branches.length} />
                <StatCard title="Products" value={dashboardData.products.length} />
                <StatCard title="POS Sales" value={dashboardData.posSales.length} />
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <StatCard
                  title="Wallet Balance"
                  value={formatMoney(dashboardData.walletSummary.totalBalanceCents)}
                  subtitle={`${dashboardData.walletSummary.walletCount} wallets`}
                />
                <StatCard
                  title="Trial Balance"
                  value={dashboardData.trialBalance.isBalanced ? 'Balanced' : 'Not Balanced'}
                  subtitle={`Debit ${formatMoney(dashboardData.trialBalance.totalDebitCents)}`}
                />
                <StatCard
                  title="Net Income"
                  value={formatMoney(dashboardData.incomeStatement.netIncomeCents)}
                  subtitle="Revenue minus expenses"
                />
              </div>
            </div>
          )}

          {activeSection === 'products' && (
            <SectionCard title="Products">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-3">Name</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Reorder Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.products.map((product) => (
                      <tr key={product.id} className="border-t border-slate-800">
                        <td className="py-3 font-semibold">{product.name}</td>
                        <td>{product.sku}</td>
                        <td>{formatMoney(product.sellingPriceCents)}</td>
                        <td>{product.stockQuantity}</td>
                        <td>{product.reorderLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {activeSection === 'pos' && (
            <SectionCard title="POS Sales">
              <div className="space-y-3">
                {dashboardData.posSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{sale.saleNumber}</p>
                        <p className="text-sm text-slate-400">
                          Payment: {sale.paymentMethod} | Items: {sale.items?.length ?? 0}
                        </p>
                      </div>
                      <p className="font-bold text-cyan-300">
                        {formatMoney(sale.totalAmountCents)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeSection === 'inventory' && (
            <SectionCard title="Inventory Movements">
              <div className="space-y-3">
                {dashboardData.inventoryMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{movement.reference}</p>
                        <p className="text-sm text-slate-400">
                          {movement.product?.name} | {movement.reason}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{movement.type}</p>
                        <p className="text-sm text-slate-400">
                          {movement.stockBefore} ? {movement.stockAfter}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeSection === 'accounting' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Trial Balance">
                <p className="text-lg font-bold text-cyan-300">
                  {dashboardData.trialBalance.isBalanced ? 'Balanced' : 'Not Balanced'}
                </p>
                <p className="mt-2 text-slate-300">
                  Debit: {formatMoney(dashboardData.trialBalance.totalDebitCents)}
                </p>
                <p className="text-slate-300">
                  Credit: {formatMoney(dashboardData.trialBalance.totalCreditCents)}
                </p>
              </SectionCard>

              <SectionCard title="Income Statement">
                <p className="text-slate-300">
                  Revenue: {formatMoney(dashboardData.incomeStatement.totalRevenueCents)}
                </p>
                <p className="text-slate-300">
                  Expenses: {formatMoney(dashboardData.incomeStatement.totalExpenseCents)}
                </p>
                <p className="mt-2 text-lg font-bold text-cyan-300">
                  Net Income: {formatMoney(dashboardData.incomeStatement.netIncomeCents)}
                </p>
              </SectionCard>

              <SectionCard title="Balance Sheet">
                <p className="text-slate-300">
                  Assets: {formatMoney(dashboardData.balanceSheet.totalAssetsCents)}
                </p>
                <p className="text-slate-300">
                  Liabilities: {formatMoney(dashboardData.balanceSheet.totalLiabilitiesCents)}
                </p>
                <p className="text-slate-300">
                  Equity: {formatMoney(dashboardData.balanceSheet.totalEquityCents)}
                </p>
              </SectionCard>

              <SectionCard title="Ledger Summary">
                <p className="text-slate-300">
                  Transactions: {dashboardData.ledgerSummary.transactionCount}
                </p>
                <p className="text-slate-300">
                  Entries: {dashboardData.ledgerSummary.entryCount}
                </p>
              </SectionCard>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              ApexBiz Enterprise Platform
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              Enterprise business management dashboard
            </h1>
            <p className="mb-8 text-slate-300">
              Manage businesses, branches, wallets, POS sales, inventory,
              double-entry ledger records, and accounting reports from one
              secure dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-white p-8 text-slate-950 shadow-2xl">
            <h2 className="mb-2 text-2xl font-bold">Sign in</h2>
            <p className="mb-6 text-sm text-slate-600">
              Use the admin account created in the backend.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-bold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'Loading dashboard...' : 'Login to dashboard'}
              </button>
            </form>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {token && (
              <p className="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
                Token received from backend successfully.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
