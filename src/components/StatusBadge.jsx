const colors = { actif: "green", "en pause": "orange", "terminé": "blue", "publié": "green", brouillon: "gray" };
export default function StatusBadge({ status }) {
  return <span className={"badge " + (colors[status] || "gray")}>{status}</span>;
}