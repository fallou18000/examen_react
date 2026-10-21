import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Learners from "./pages/Learners";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LearnerProfile from "./pages/LearnerProfile";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/learners" element={<Learners />} />
        <Route path="/learners/:id" element={<LearnerProfile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="*" element={<p>Page introuvable</p>} />
      </Route>
    </Routes>
  );
}