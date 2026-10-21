import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    navigate("/learners?q=" + encodeURIComponent(search));
  };

  const links = [
    { to: "/", label: " Dashboard" },
    { to: "/learners", label: " Apprenants" },
    { to: "/courses", label: " Formations" },
  ];

  return (
    <div className="app">
      <aside className={"sidebar" + (open ? " open" : "")}>
        <h2 className="logo">SkillBoard</h2>
        <nav>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="burger" onClick={() => setOpen(!open)}>☰</button>
          <form onSubmit={submit} className="search">
            <input placeholder="Rechercher un apprenant..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </form>
          <span className="bell" title="3 notifications">🔔<b>3</b></span>
          <div className="profile"><span className="avatar">AD</span> Admin</div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}