import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import useResources from "../hooks/useResources";
import { api } from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function CourseDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useResources("courses", "enrollments", "learners");

  const info = useMemo(() => {
    if (!data.courses) return null;
    const course = data.courses.find((c) => c.id === Number(id));
    if (!course) return null;
    const enrolled = data.enrollments
      .filter((e) => e.courseId === course.id)
      .map((e) => ({ ...e, learner: data.learners.find((l) => l.id === e.learnerId) }))
      .filter((e) => e.learner);
    const avg = enrolled.length ? Math.round(enrolled.reduce((s, e) => s + e.progress, 0) / enrolled.length) : 0;
    return { course, enrolled, avg };
  }, [data, id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!info) return <p>Formation introuvable. <Link to="/courses">Retour</Link></p>;

  const { course, enrolled, avg } = info;

  const toggleStatus = async () => {
    await api.patch("/courses/" + course.id, { status: course.status === "publié" ? "brouillon" : "publié" });
    reload();
  };

  return (
    <>
      <Link to="/courses">← Retour au catalogue</Link>
      <div className="row between">
        <h1>{course.title} <StatusBadge status={course.status} /></h1>
        <button className="btn primary" onClick={toggleStatus}>
          {course.status === "publié" ? "Passer en brouillon" : "Publier"}
        </button>
      </div>

      <section className="card">
        <p>{course.description}</p>
        <p className="muted">Catégorie : {course.category} · Coach : <b>{course.coach}</b> · Capacité max : <b>{course.capacity}</b></p>
        <p>Remplissage : {enrolled.length}/{course.capacity}</p>
        <div className="progress"><div style={{ width: (enrolled.length / course.capacity) * 100 + "%" }} /></div>
        <p>Progression moyenne : {avg}%</p>
        <div className="progress"><div style={{ width: avg + "%" }} /></div>
      </section>

      <section className="card">
        <h3>Apprenants inscrits</h3>
        {enrolled.map((e) => (
          <div key={e.id} className="list-item">
            <Link to={"/learners/" + e.learner.id} state={{ from: "/courses/" + course.id }}>{e.learner.name}</Link>
            <div className="progress small"><div style={{ width: e.progress + "%" }} /></div>
            <b>{e.progress}%</b>
          </div>
        ))}
        {enrolled.length === 0 && <p className="muted">Aucun inscrit.</p>}
      </section>
    </>
  );
}