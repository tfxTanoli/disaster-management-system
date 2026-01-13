import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Admin Pages
// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { AlertsManager } from './pages/admin/AlertsManager';
import { RiskAssessment } from './pages/admin/RiskAssessment';
import { Inventory } from './pages/admin/Inventory';
import { AdminLiveMap } from './pages/admin/AdminLiveMap';
import { AdminReports } from './pages/admin/AdminReports';
import { UserManagement } from './pages/admin/UserManagement';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { PublicAlerts } from './pages/public/PublicAlerts';
import { Guidelines } from './pages/public/Guidelines';
import { ReportIncident } from './pages/public/ReportIncident';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { DamageAssessment } from './pages/public/DamageAssessment';
import { Facilities } from './pages/public/Facilities';
import { Ngo } from './pages/public/Ngo';
import { Videos } from './pages/public/Videos';
import { Forecast } from './pages/public/Forecast';
import { Privacy } from './pages/public/Privacy';

// Auth Pages
// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { RiskMap } from './pages/public/RiskMap';
import { Blogs } from './pages/public/Blogs';
import { Subscription } from './pages/public/Subscription';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public Routes (Accessible to everyone) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/alerts" element={<PublicAlerts />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/ngos" element={<Ngo />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/subscription" element={<Subscription />} />
          </Route>

          {/* Protected Public Routes (Registered Users & Admins) */}
          <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
            <Route element={<PublicLayout />}>
              <Route path="/risk-map" element={<RiskMap />} />
              <Route path="/report-incident" element={<ReportIncident />} />
              <Route path="/damage-assessment" element={<DamageAssessment />} />
            </Route>
          </Route>

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes (Admin Only) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="risk-assessment" element={<RiskAssessment />} />
              <Route path="alerts" element={<AlertsManager />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="live-map" element={<AdminLiveMap />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
