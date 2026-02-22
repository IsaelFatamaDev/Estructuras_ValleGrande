import { Routes, Route, Navigate } from "react-router-dom";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import PlatformLayout from "./pages/platform/PlatformLayout";
import Semester1 from "./pages/platform/Semester1";
import Semester2 from "./pages/platform/Semester2";
import SemesterComingSoon from "./pages/platform/SemesterComingSoon";
import { useAuth } from "./context/useAuth";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/plataforma/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/plataforma/login" element={<Login />} />
      <Route
        path="/plataforma"
        element={
          <ProtectedRoute>
            <PlatformLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/plataforma/semestre/1" replace />} />
        <Route path="semestre/1" element={<Semester1 />} />
        <Route path="semestre/2" element={<Semester2 />} />
        <Route path="semestre/:id" element={<SemesterComingSoon />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
