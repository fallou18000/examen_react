import fs from "fs";

const statuses = ["actif", "en pause", "terminé"];
const names = ["Awa Diop","Moussa Fall","Fatou Sow","Ibrahima Ndiaye","Aminata Ba","Cheikh Sarr","Mariama Diallo","Ousmane Faye","Khady Gueye","Abdoulaye Sy","Seynabou Thiam","Pape Mbaye","Ndeye Cissé","Modou Kane","Aïda Seck","Lamine Badji","Rokhaya Niang","Samba Diouf","Coumba Wade","Alioune Mbow","Bineta Lo","Mamadou Camara","Sokhna Dione","Babacar Gaye","Yacine Ndoye","Idrissa Tine","Astou Fall","Malick Sène","Dior Samb","Tidiane Bâ"];

const courses = [
  { id: 1, title: "React.js avancé", category: "Développement", coach: "Mame Sarr", capacity: 25, status: "publié", description: "Hooks, routing, architecture et bonnes pratiques React." },
  { id: 2, title: "UI/UX Design", category: "Design", coach: "Julie Martin", capacity: 20, status: "publié", description: "Principes de design d'interface et prototypage Figma." },
  { id: 3, title: "Data Analysis avec Python", category: "Data", coach: "Omar Ka", capacity: 30, status: "publié", description: "Pandas, visualisation et analyse de données." },
  { id: 4, title: "Marketing Digital", category: "Marketing", coach: "Léa Dupont", capacity: 25, status: "brouillon", description: "SEO, réseaux sociaux et campagnes publicitaires." },
  { id: 5, title: "Node.js & API REST", category: "Développement", coach: "Mame Sarr", capacity: 20, status: "publié", description: "Construire des API robustes avec Express." },
  { id: 6, title: "Cybersécurité", category: "Réseaux", coach: "Ali Ben", capacity: 15, status: "brouillon", description: "Fondamentaux de la sécurité informatique." },
];

const learners = names.map((name, i) => ({
  id: i + 1,
  name,
  email: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ".") + "@mail.com",
  status: statuses[i % 3],
  joinedAt: `2026-${String((i % 10) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
}));

const enrollments = [];
const activities = [];

learners.forEach((l) => {
  [l.id % 6 + 1, (l.id * 2) % 6 + 1]
    .filter((v, i, a) => a.indexOf(v) === i)
    .forEach((cid) =>
      enrollments.push({
        id: enrollments.length + 1,
        learnerId: l.id,
        courseId: cid,
        progress: (l.id * 13 + cid * 7) % 101,
        date: l.joinedAt,
      })
    );
  activities.push({ id: activities.length + 1, learnerId: l.id, text: "Connexion à la plateforme", date: l.joinedAt });
  activities.push({ id: activities.length + 1, learnerId: l.id, text: "Module terminé", date: l.joinedAt });
});

fs.writeFileSync("db.json", JSON.stringify({ learners, courses, enrollments, activities }, null, 2));
console.log("db.json généré avec succès");