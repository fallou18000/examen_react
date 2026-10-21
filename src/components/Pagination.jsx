export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button className="btn" disabled={page === 1} onClick={() => onChange(page - 1)}>←</button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i} className={"btn" + (page === i + 1 ? " primary" : "")}
          onClick={() => onChange(i + 1)}>{i + 1}</button>
      ))}
      <button className="btn" disabled={page === totalPages} onClick={() => onChange(page + 1)}>→</button>
    </div>
  );
}