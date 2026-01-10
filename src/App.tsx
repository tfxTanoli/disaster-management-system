import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Admin Pages
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import { RiskAssessment } from './pages/admin/RiskAssessment';
import { Inventory } from './pages/admin/Inventory';

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
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { RiskMap } from './pages/public/RiskMap';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/alerts" element={<PublicAlerts />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/report-incident" element={<ReportIncident />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/damage-assessment" element={<DamageAssessment />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/ngos" element={<Ngo />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/risk-map" element={<RiskMap />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="risk-assessment" element={<RiskAssessment />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="inventory" element={<Inventory />} />
            {/* Placeholders for future routes */}
            <Route path="reports" element={<Dashboard />} />
            <Route path="live-map" element={<Dashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
