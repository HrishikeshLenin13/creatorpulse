const compactFormatter = new Intl.NumberFormat('en-US', {notation:'compact',maximumFractionDigits:1});
const currencyFormatter = new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:2});
export function formatCompactNumber(value: number) { return compactFormatter.format(value); }
export function formatCurrency(value: number) { return currencyFormatter.format(value); }

export function estimateEarnings(views: number, engagementRate: number) {
  if (![views, engagementRate].every(value => Number.isFinite(value) && value >= 0)) return 0;
  const baseCpm = 2.3;
  const engagementBoost = 1 + engagementRate / 100;
  const value=(views / 1000) * baseCpm * engagementBoost;
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}
