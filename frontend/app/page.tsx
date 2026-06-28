'use client';

import { useState } from 'react';
import { apiRequest } from '../lib/api';

type UserResponse = {
  message?: string;
  user?: {
    id: string;
    username: string;
    role: string;
    status: string;
  };
};

export default function Home() {
  const [username, setUsername] = useState('rbacadmin');
  const [password, setPassword] = useState('admin123');
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginResponse = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const accessToken = loginResponse.accessToken;
      setToken(accessToken);

      const meResponse = await apiRequest('/auth/me', {}, accessToken);
      setUserData(meResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setUserData(null);
      setToken('');
    } finally {
      setLoading(false);
    }
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-2xl font-bold text-cyan-300">14</p>
                <p className="text-sm text-slate-300">Backend phases completed</p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-2xl font-bold text-cyan-300">RBAC</p>
                <p className="text-sm text-slate-300">Role-based access control</p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-2xl font-bold text-cyan-300">Ledger</p>
                <p className="text-sm text-slate-300">Double-entry accounting</p>
              </div>

              <div className="rounded-2xl bg-slate-800 p-5">
                <p className="text-2xl font-bold text-cyan-300">POS</p>
                <p className="text-sm text-slate-300">Sales and inventory</p>
              </div>
            </div>
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
                  placeholder="rbacadmin"
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
                  placeholder="admin123"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-bold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? 'Signing in...' : 'Login to dashboard'}
              </button>
            </form>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {userData?.user && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-bold text-emerald-800">
                  Login successful
                </p>
                <p className="mt-2 text-sm text-emerald-700">
                  Username: {userData.user.username}
                </p>
                <p className="text-sm text-emerald-700">
                  Role: {userData.user.role}
                </p>
                <p className="text-sm text-emerald-700">
                  Status: {userData.user.status}
                </p>
              </div>
            )}

            {token && (
              <p className="mt-4 break-all rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
                Token received from backend successfully.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
