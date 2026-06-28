'use client';

import { useState } from 'react';
import { apiRequest } from '../lib/api';

type AuditLogsDashboardProps = {
  token: string;
};

function shortHash(hash?: string | null) {
  if (!hash) {
    return 'N/A';
  }

  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function AuditLogsDashboard({ token }: AuditLogsDashboardProps) {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [chainResult, setChainResult] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [checkingChain, setCheckingChain] = useState(false);

  async function loadAuditLogs() {
    setLoadingLogs(true);
    setMessage('');
    setError('');

    try {
      const logs = await apiRequest('/audit-logs?limit=50', {}, token);
      setAuditLogs(logs);
      setMessage('Audit logs loaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoadingLogs(false);
    }
  }

  async function verifyHashChain() {
    setCheckingChain(true);
    setMessage('');
    setError('');

    try {
      const result = await apiRequest('/audit-logs/verify-chain', {}, token);
      setChainResult(result);
      setMessage(result.message || 'Hash chain checked successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify hash chain');
    } finally {
      setCheckingChain(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <h3 className="text-lg font-bold text-white">Security Audit Dashboard</h3>
        <p className="mt-2 text-sm text-slate-400">
          View backend audit logs and verify the blockchain-style audit hash chain.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={loadAuditLogs}
            disabled={loadingLogs}
            className="rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400 disabled:bg-slate-600"
          >
            {loadingLogs ? 'Loading logs...' : 'Load Audit Logs'}
          </button>

          <button
            onClick={verifyHashChain}
            disabled={checkingChain}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-400 disabled:bg-slate-600"
          >
            {checkingChain ? 'Checking chain...' : 'Verify Hash Chain'}
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>

      {chainResult && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
          <h3 className="text-lg font-bold text-white">Hash Chain Result</h3>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Valid</p>
              <p className={chainResult.valid ? 'text-2xl font-bold text-emerald-300' : 'text-2xl font-bold text-red-300'}>
                {chainResult.valid ? 'YES' : 'NO'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Message</p>
              <p className="mt-1 font-semibold text-white">{chainResult.message}</p>
            </div>

            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Logs Checked</p>
              <p className="text-2xl font-bold text-cyan-300">
                {chainResult.totalAuditLogsChecked ?? 0}
              </p>
            </div>
          </div>

          {chainResult.brokenAuditLogId && (
            <p className="mt-4 text-sm text-red-400">
              Broken audit log ID: {chainResult.brokenAuditLogId}
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <h3 className="mb-4 text-lg font-bold text-white">Recent Audit Logs</h3>

        {auditLogs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-8 text-center">
            <p className="text-lg font-bold text-white">No audit logs loaded</p>
            <p className="mt-2 text-sm text-slate-400">
              Click Load Audit Logs to view recent security audit records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Path</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">IP</th>
                  <th className="pb-3">Current Hash</th>
                  <th className="pb-3">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-3 font-medium text-white">{log.action}</td>
                    <td className="py-3 text-cyan-300">{log.method}</td>
                    <td className="py-3 text-slate-300">{log.path}</td>
                    <td className="py-3 text-slate-300">{log.statusCode}</td>
                    <td className="py-3 text-slate-300">{log.ipAddress}</td>
                    <td className="py-3 font-mono text-xs text-emerald-300">
                      {shortHash(log.currentHash)}
                    </td>
                    <td className="py-3 text-slate-300">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
