import "./App.css";
import "./styles/Transitions.scss";
import { Routes, Route, useLocation } from "react-router-dom";
import { TransitionProvider } from "./context/TransitionContext";
import { DataProvider } from "./context/DataContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SharedHeader from "./components/SharedHeader";
import AnimatedRouter from "./components/AnimatedRouter";

// Admin pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/pages/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAbout from "./admin/pages/AdminAbout";
import AdminExperience from "./admin/pages/AdminExperience";
import AdminProjects from "./admin/pages/AdminProjects";
import AdminContact from "./admin/pages/AdminContact";
import AdminSocials from "./admin/pages/AdminSocials";
import AdminSettings from "./admin/pages/AdminSettings";

/**
 * ProtectedRoute — redirects to admin login if not authenticated.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
        Loading...
      </div>
    );
  }

  if (!user) return <AdminLogin />;
  return children;
}

/**
 * App
 *
 * Root component. Structure:
 * - DataProvider: fetches all portfolio data from API, provides to all components
 * - TransitionProvider: manages navigation state + click pause
 * - SharedHeader: persistent logo + nav with Framer layoutId animation
 * - AnimatedRouter: route rendering with AnimatePresence exit/enter transitions
 * - /admin/*: separate admin panel with Firebase Auth
 */
function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Admin routes — completely separate layout, no animated transitions
  if (isAdmin) {
    return (
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="experience" element={<AdminExperience />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="socials" element={<AdminSocials />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    );
  }

  // Portfolio routes — original animated layout
  return (
    <DataProvider>
      <TransitionProvider>
        <div className="App">
          <SharedHeader />
          <AnimatedRouter />
        </div>
      </TransitionProvider>
    </DataProvider>
  );
}

export default App;
