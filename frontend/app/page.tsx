'use client';

import { useState, type FormEvent } from 'react';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { ProductsTable } from '../components/ProductsTable';
import { InventoryMovementsTable } from '../components/InventoryMovementsTable';
import { PosSalesTable } from '../components/PosSalesTable';
import { AuditLogsDashboard } from '../components/AuditLogsDashboard';
import { MlInsightsDashboard } from '../components/MlInsightsDashboard';
import { CreateProductForm } from '../components/CreateProductForm';
import { UpdateProductForm } from '../components/UpdateProductForm';
import { InventoryActionForm } from '../components/InventoryActionForm';
import { CreatePosSaleForm } from '../components/CreatePosSaleForm';
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

type ActiveSection = 'overview' | 'products' | 'pos' | 'inventory' | 'accounting' | 'security' | 'ml-insights';

export default function Home() {
  const [username, setUsername] = useState('rbacadmin');
  const [password, setPassword] = useState('admin123');
  const [token, setToken] = useState('');
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
          {/* FORCE_VISIBLE_ML_CONTENT */}
          {activeSection === 'ml-insights' && (
            <SectionCard title="Data Science / ML Insights">
              <MlInsightsDashboard token={token} />
            </SectionCard>
          )}

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
              <div className="mt-2 flex gap-2">
                <button
                  onClick={async () => {
                    setRefreshing(true);

                    try {
                      await loadDashboardData(token);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Refresh failed');
                    } finally {
                      setRefreshing(false);
                    }
                  }}
                  disabled={refreshing}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:bg-slate-600"
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
                >
                  Logout
                </button>
              </div>
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

          
          {/* EXTRA_SECURITY_ML_TABS */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSection('security')}
              className={`rounded-xl px-5 py-3 font-bold ${
                activeSection === 'security'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              Security
            </button>

            <button
              onClick={() => setActiveSection('ml-insights')}
              className={`rounded-xl px-5 py-3 font-bold ${
                activeSection === 'ml-insights'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              ML Insights
            </button>
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
              {dashboardData.businesses[0]?.id && (
                <CreateProductForm
                  token={token}
                  businessId={dashboardData.businesses[0].id}
                  onSuccess={async () => {
                    await loadDashboardData(token);
                  }}
                />
              )}

              <UpdateProductForm
                token={token}
                products={dashboardData.products}
                onSuccess={async () => {
                  await loadDashboardData(token);
                }}
              />

                            <ProductsTable products={dashboardData.products} />
            </SectionCard>
          )}

          {activeSection === 'pos' && (
            <SectionCard title="POS Sales">
              {dashboardData.businesses[0]?.id && dashboardData.branches[0]?.id && (
                <CreatePosSaleForm
                  token={token}
                  businessId={dashboardData.businesses[0].id}
                  branchId={dashboardData.branches[0].id}
                  cashierId={user.id}
                  products={dashboardData.products}
                  onSuccess={async () => {
                    await loadDashboardData(token);
                  }}
                />
              )}

              <PosSalesTable sales={dashboardData.posSales} />
            </SectionCard>
          )}

          {activeSection === 'inventory' && (
            <SectionCard title="Inventory Movements">
              {dashboardData.businesses[0]?.id && dashboardData.branches[0]?.id && (
                <InventoryActionForm
                  token={token}
                  businessId={dashboardData.businesses[0].id}
                  branchId={dashboardData.branches[0].id}
                  createdById={user.id}
                  products={dashboardData.products}
                  onSuccess={async () => {
                    await loadDashboardData(token);
                  }}
                />
              )}

              <div className="space-y-3">
              <InventoryMovementsTable movements={dashboardData.inventoryMovements} />
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
    
          {activeSection === 'security' && (
            <SectionCard title="Security Audit Logs">
              <AuditLogsDashboard token={token} />
            </SectionCard>
          )}

          {activeSection === 'ml-insights' && (
            <SectionCard title="Data Science / ML Insights">
              <MlInsightsDashboard token={token} />
            </SectionCard>
          )}

          {/* FORCE_ML_INSIGHTS_SECTION */}
          {activeSection === 'ml-insights' && (
            <SectionCard title="Data Science / ML Insights">
              <MlInsightsDashboard token={token} />
            </SectionCard>
          )}

          {/* FORCE_SECURITY_SECTION */}
          {activeSection === 'security' && (
            <SectionCard title="Security Audit Logs">
              <AuditLogsDashboard token={token} />
            </SectionCard>
          )}
</main>
  );
}



























