import { useState } from "react";

export default function LearnerForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { name: "", email: "", status: "actif" });
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Le nom est obligatoire.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Email invalide.");
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="form">
      <label>Nom<input name="name" value={form.name} onChange={change} /></label>
      <label>Email<input name="email" value={form.email} onChange={change} /></label>
      <label>Statut
        <select name="status" value={form.status} onChange={change}>
          <option>actif</option><option>en pause</option><option>terminé</option>
        </select>
      </label>
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button type="button" className="btn" onClick={onCancel}>Annuler</button>
        <button className="btn primary">Enregistrer</button>
      </div>
    </form>
  );
}