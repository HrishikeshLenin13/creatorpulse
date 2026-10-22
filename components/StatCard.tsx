export function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="stat-card glass-panel">
      <span className="muted-label">{label}</span>
      <div className="stat-row">
        <strong>{value}</strong>
        <span className="delta up">{delta}</span>
      </div>
    </div>
  );
}
