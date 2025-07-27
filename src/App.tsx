import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ElectionProvider } from './contexts/ElectionContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/student/StudentDashboard';
import VoterIDPage from './pages/student/VoterIDPage';
import ElectionListPage from './pages/student/ElectionListPage';
import CandidateViewPage from './pages/student/CandidateViewPage';
import ResultsPage from './pages/student/ResultsPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateElection from './pages/admin/CreateElection';
import LiveMonitoring from './pages/admin/LiveMonitoring';
import AdminResults from './pages/admin/AdminResults';
import CampusBot from './components/CampusBot';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-primary-bg">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Student Routes */}
        <Route 
          path="/dashboard" 
          element={user?.role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/voter-id" 
          element={user?.role === 'student' ? <VoterIDPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/elections" 
          element={user?.role === 'student' ? <ElectionListPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/election/:id/candidates" 
          element={user?.role === 'student' ? <CandidateViewPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/election/:id/results" 
          element={user?.role === 'student' ? <ResultsPage /> : <Navigate to="/" />} 
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/create-election" 
          element={user?.role === 'admin' ? <CreateElection /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/monitoring" 
          element={user?.role === 'admin' ? <LiveMonitoring /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/results" 
          element={user?.role === 'admin' ? <AdminResults /> : <Navigate to="/admin/login" />} 
        />
      </Routes>
      
      <CampusBot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <ElectionProvider>
            <AppRoutes />
          </ElectionProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;