import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useResources from "../hooks/useResources";
import StatusBadge from "../components/StatusBadge";

export default function Courses() {
  const { data, loading, error } = useResources("courses", "enrollments");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("toutes");
  const [status, setStatus] = useState("tous");
  const [view, setView] = useState("grid");

  const categories = useMemo(() => [...new Set((data.courses || []).map((c) => c.category))], [data]);

  const list = useMemo(() =>
    (data.courses || []).filter((c) =>
      (category === "toutes" || c.category === category) &&
      (status === "tous" || c.status === status) &&
      c.title.toLowerCase().includes(q.toLowerCase())), [data, q, category, status]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="row between">
        <h1>Formations</h1>
        <div>
          <button className={"btn" + (view === "grid" ? " primary" : "")} onClick={() => setView("grid")}>▦ Grille</button>{" "}
          <button className={"btn" + (view === "list" ? " primary" : "")} onClick={() => setView("list")}>☰ Liste</button>
        </div>
      </div>

      <div className="toolbar">
        <input placeholder="Rechercher une formation..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="toutes">Toutes catégories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="tous">Publiées + brouillons</option>
          <option value="publié">Publiées</option>
          <option value="brouillon">Brouillons</option>
        </select>
      </div>

      <div className={view === "grid" ? "grid3" : "stack"}>
        {list.map((c) => (
          <div key={c.id} className={"card course" + (view === "list" ? " course-list" : "")}>
            <div>
              <StatusBadge status={c.status} />
              <h3>{c.title}</h3>
              <p className="muted">{c.category} · Coach : {c.coach}</p>
            </div>
            <div>
              <p>👥 {data.enrollments.filter((e) => e.courseId === c.id).length} apprenants</p>
              <Link className="btn primary" to={"/courses/" + c.id}>Voir le détail</Link>
            </div>
          </div>
        ))}
        {list.length === 0 && <p>Aucune formation trouvée.</p>}
      </div>
    </>
  );
}