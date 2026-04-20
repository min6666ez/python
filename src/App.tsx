import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./lib/firebase";
import { PyodideProvider } from './contexts/PyodideContext';
import Home from "@/pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Lesson from "./pages/Lesson";
import Exercise from "./pages/Exercise";
import Test from "./pages/Test";
import Achievements from "./pages/Achievements";
import { DataAnalysisHome } from './pages/DataAnalysisHome';
import { DataAnalysisProject } from './pages/DataAnalysisProject';

export default function App() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PyodideProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<Lesson />} />
          <Route path="/exercise/:id" element={<Exercise />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/data-analysis" element={<DataAnalysisHome />} />
          <Route path="/data-analysis/:projectId" element={<DataAnalysisProject />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </PyodideProvider>
  );
}
