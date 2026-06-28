export function formatMoney(cents: number | undefined) {
  const value = (cents ?? 0) / 100;
  return `LKR ${value.toLocaleString()}`;
}
