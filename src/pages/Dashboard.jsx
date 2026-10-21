import { useMemo } from "react";
import { Link } from "react-router-dom";
import useResources from "../hooks/useResources";
import StatCard from "../components/StatCard";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];

export default function Dashboard() {
  const { data, loading, error } = useResources("learners", "courses", "enrollments");

  const stats = useMemo(() => {
    if (!data.learners) return null;
    const { learners, courses, enrollments } = data;
    const completion = Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length);
    const monthly = MONTHS.map((m, i) => ({
      m, count: enrollments.filter((e) => new Date(e.date).getMonth() === i).length,
    }));
    const popular = courses
      .map((c) => ({ ...c, n: enrollments.filter((e) => e.courseId === c.id).length }))
      .sort((a, b) => b.n - a.n).slice(0, 4);
    const latest = [...enrollments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
      .map((e) => ({ ...e, learner: learners.find((l) => l.id === e.learnerId), course: courses.find((c) => c.id === e.courseId) }));
    return { completion, monthly, popular, latest, max: Math.max(...monthly.map((x) => x.count), 1) };
  }, [data]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>Dashboard</h1>
      <div className="grid4">
        <StatCard icon="👩‍🎓" label="Apprenants" value={data.learners.length} />
        <StatCard icon="📚" label="Formations" value={data.courses.length} />
        <StatCard icon="📝" label="Inscriptions" value={data.enrollments.length} />
        <StatCard icon="✅" label="Taux de complétion" value={stats.completion + "%"} />
      </div>

      <div className="grid2">
        <section className="card">
          <h3>Inscriptions mensuelles</h3>
          <div className="chart">
            {stats.monthly.map((x) => (
              <div key={x.m} className="bar-col">
                <span className="muted">{x.count}</span>
                <div className="bar" style={{ height: (x.count / stats.max) * 140 + "px" }} />
                <small>{x.m}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Formations populaires</h3>
          {stats.popular.map((c) => (
            <Link key={c.id} to={"/courses/" + c.id} className="list-item">
              <span>{c.title}</span><b>{c.n} inscrits</b>
            </Link>
          ))}
        </section>
      </div>

      <section className="card">
        <h3>Dernières inscriptions</h3>
        {stats.latest.map((e) => (
          <div key={e.id} className="list-item">
            <Link to={"/learners/" + e.learner.id}>{e.learner.name}</Link>
            <span>{e.course.title}</span>
            <span className="muted">{e.date}</span>
          </div>
        ))}
      </section>
    </>
  );
}