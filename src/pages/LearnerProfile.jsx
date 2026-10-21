import { useState, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import useResources from "../hooks/useResources";
import { api } from "../services/api";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import LearnerForm from "../components/LearnerForm";

export default function LearnerProfile() {
  const { id } = useParams();
  const { state } = useLocation();
  const [edit, setEdit] = useState(false);
  const { data, loading, error, reload } = useResources("learners", "courses", "enrollments", "activities");

  const info = useMemo(() => {
    if (!data.learners) return null;
    const learner = data.learners.find((l) => l.id === Number(id));
    if (!learner) return null;
    return {
      learner,
      mine: data.enrollments.filter((e) => e.learnerId === learner.id)
        .map((e) => ({ ...e, course: data.courses.find((c) => c.id === e.courseId) })),
      history: data.activities.filter((a) => a.learnerId === learner.id),
    };
  }, [data, id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!info) return <p>Apprenant introuvable. <Link to="/learners">Retour</Link></p>;

  const { learner, mine, history } = info;
  const back = state?.from || "/learners";

  const save = async (form) => {
    await api.patch("/learners/" + learner.id, form);
    setEdit(false);
    reload();
  };

  return (
    <>
      <Link to={back}>← Retour {state?.from ? "à la formation" : "à la liste"}</Link>
      <div className="card profile-head">
        <span className="avatar big">{learner.name.split(" ").map((w) => w[0]).join("")}</span>
        <div>
          <h1>{learner.name}</h1>
          <p>{learner.email}</p>
          <p className="muted">Inscrit le {learner.joinedAt} <StatusBadge status={learner.status} /></p>
        </div>
        <button className="btn primary" onClick={() => setEdit(true)}>Modifier le profil</button>
      </div>

      <div className="grid2">
        <section className="card">
          <h3>Formations suivies</h3>
          {mine.map((e) => (
            <div key={e.id} className="block">
              <Link to={"/courses/" + e.course.id}>{e.course.title}</Link>
              <div className="progress"><div style={{ width: e.progress + "%" }} /></div>
              <small>{e.progress}%</small>
            </div>
          ))}
        </section>
        <section className="card">
          <h3>Historique des activités</h3>
          <ul className="timeline">
            {history.map((a) => <li key={a.id}>{a.text} <span className="muted">— {a.date}</span></li>)}
          </ul>
        </section>
      </div>

      {edit && (
        <Modal title="Modifier le profil" onClose={() => setEdit(false)}>
          <LearnerForm initial={learner} onSubmit={save} onCancel={() => setEdit(false)} />
        </Modal>
      )}
    </>
  );
}