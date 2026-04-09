import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/global.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlanDay from './pages/PlanDay';
import Breakdown from './pages/Breakdown';
import FocusSession from './pages/FocusSession';
import Reflection from './pages/Reflection';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!token) return <Navigate to="/login" />;
  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (token) return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><PlanDay /></ProtectedRoute>} />
          <Route path="/breakdown/:id" element={<ProtectedRoute><Breakdown /></ProtectedRoute>} />
          <Route path="/focus/:id" element={<ProtectedRoute><FocusSession /></ProtectedRoute>} />
          <Route path="/reflect/:id" element={<ProtectedRoute><Reflection /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
