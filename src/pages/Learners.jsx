import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useResources from "../hooks/useResources";
import { api } from "../services/api";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import LearnerForm from "../components/LearnerForm";

const PER_PAGE = 8;

export default function Learners() {
  const { data, loading, error, reload } = useResources("learners");
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [status, setStatus] = useState("tous");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | { learner? }
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const list = (data.learners || []).filter((l) =>
      (status === "tous" || l.status === status) &&
      (l.name + l.email).toLowerCase().includes(q.toLowerCase()));
    return list.sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b.joinedAt.localeCompare(a.joinedAt));
  }, [data, q, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const save = async (form) => {
    if (modal.learner) await api.patch("/learners/" + modal.learner.id, form);
    else await api.post("/learners", { ...form, joinedAt: new Date().toISOString().slice(0, 10) });
    setModal(null);
    reload();
  };

  const remove = useCallback(async (l) => {
    if (!window.confirm(`Supprimer ${l.name} ?`)) return;
    await api.remove("/learners/" + l.id);
    reload();
  }, [reload]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="row between">
        <h1>Apprenants</h1>
        <button className="btn primary" onClick={() => setModal({})}>+ Ajouter</button>
      </div>

      <div className="toolbar">
        <input placeholder="Nom ou email..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="tous">Tous les statuts</option>
          <option>actif</option><option>en pause</option><option>terminé</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Tri : nom</option>
          <option value="date">Tri : date d'inscription</option>
        </select>
      </div>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Nom</th><th>Email</th><th>Inscription</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td data-label="Nom">{l.name}</td>
                <td data-label="Email">{l.email}</td>
                <td data-label="Inscription">{l.joinedAt}</td>
                <td data-label="Statut"><StatusBadge status={l.status} /></td>
                <td data-label="Actions" className="actions">
                  <button className="btn" onClick={() => navigate("/learners/" + l.id)}>👁</button>
                  <button className="btn" onClick={() => setModal({ learner: l })}>✏️</button>
                  <button className="btn danger" onClick={() => remove(l)}>🗑</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="5">Aucun résultat.</td></tr>}
          </tbody>
        </table>
      </div>

      <Pagination page={current} totalPages={totalPages} onChange={setPage} />

      {modal && (
        <Modal title={modal.learner ? "Modifier l'apprenant" : "Nouvel apprenant"} onClose={() => setModal(null)}>
          <LearnerForm initial={modal.learner} onSubmit={save} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </>
  );
}