type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status?.toUpperCase();

  const className =
    normalizedStatus === 'ACTIVE'
      ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30'
      : normalizedStatus === 'INACTIVE'
        ? 'bg-red-500/10 text-red-300 ring-1 ring-red-500/30'
        : 'bg-slate-500/10 text-slate-300 ring-1 ring-slate-500/30';

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {normalizedStatus || 'UNKNOWN'}
    </span>
  );
}
