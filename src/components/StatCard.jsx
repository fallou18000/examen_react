export default function StatCard({ icon, label, value }) {
  return (
    <div className="card stat">
      <span className="stat-icon">{icon}</span>
      <div><p className="muted">{label}</p><h3>{value}</h3></div>
    </div>
  );
}