import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import TradingBoard from './Component/TradingBoard';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import EmailVerification from './Pages/Auth/EmailVerification';
import RegisterSuccess from './Pages/Auth/RegisterSuccess';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import LandingPage from './Pages/Landing/LandingPage';
import ChangePassword from './Pages/Auth/ChangePassword';
import PasswordUpdated from './Pages/Auth/PasswordUpdated';
import { useTranslation } from 'react-i18next';
import Pricing from './Pages/Pricing/Pricing';
import Analysis from './Pages/Analysis/Analysis';

const MEASUREMENT_ID = 'G-0XGFBSVTMZ'; // Replace with your Measurement ID
ReactGA.initialize(MEASUREMENT_ID);

// Xử lý ngôn ngữ từ URL
function LanguageRoute({ children }) {
  const { i18n } = useTranslation();
  const params = useParams();
  
  useEffect(() => {
    if (params.lang && ['en', 'vi', 'ja'].includes(params.lang)) {
      i18n.changeLanguage(params.lang);
      localStorage.setItem('preferredLanguage', params.lang);
    }
  }, [params.lang, i18n]);
  
  return children;
}

// Component để xử lý redirect mặc định
function DefaultRedirect() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';

  // Nếu đã đăng nhập, chuyển đến trang analysis
  return <Navigate to={`/${currentLang}/analysis`} replace />;
}

function App() {
  const { i18n } = useTranslation();
  const defaultLang = i18n.language || localStorage.getItem('preferredLanguage') || 'en';

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes mặc định sẽ chuyển hướng đến route có ngôn ngữ */}
          <Route path="/" element={<ProtectedRoute><DefaultRedirect /></ProtectedRoute>} />
          <Route path="/landing" element={<Navigate to={`/${defaultLang}/landing`} replace />} />
          <Route path="/login" element={<Navigate to={`/${defaultLang}/login`} replace />} />
          <Route path="/register" element={<Navigate to={`/${defaultLang}/register`} replace />} />
          <Route path="/forgot-password" element={<Navigate to={`/${defaultLang}/forgot-password`} replace />} />
          <Route path="/verify-email" element={<Navigate to={`/${defaultLang}/verify-email`} replace />} />
          <Route path="/register-success" element={<Navigate to={`/${defaultLang}/register-success`} replace />} />
          <Route path="/change-password" element={<Navigate to={`/${defaultLang}/change-password`} replace />} />
          <Route path="/password-updated" element={<Navigate to={`/${defaultLang}/password-updated`} replace />} />
          <Route path="/analysis" element={<Navigate to={`/${defaultLang}/analysis`} replace />} />

          {/* Routes với ngôn ngữ */}
          <Route path="/:lang" element={<LanguageRoute><DefaultRedirect /></LanguageRoute>} />
          <Route path="/:lang/landing" element={
            <LanguageRoute>
              <LandingPage />
            </LanguageRoute>
          } />
          <Route path="/:lang/login" element={
            <LanguageRoute>
              <Login />
            </LanguageRoute>
          } />
          <Route path="/:lang/register" element={
            <LanguageRoute>
              <Register />
            </LanguageRoute>
          } />
          <Route path="/:lang/forgot-password" element={
            <LanguageRoute>
              <ForgotPassword />
            </LanguageRoute>
          } />
          <Route path="/:lang/verify-email" element={
            <LanguageRoute>
              <EmailVerification />
            </LanguageRoute>
          } />
          <Route path="/:lang/register-success" element={
            <LanguageRoute>
              <RegisterSuccess />
            </LanguageRoute>
          } />
          <Route path="/:lang/change-password" element={
            <LanguageRoute>
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            </LanguageRoute>
          } />
          <Route path="/:lang/password-updated" element={
            <LanguageRoute>
              <PasswordUpdated />
            </LanguageRoute>
          } />
          <Route path="/:lang/pricing" element={
            <LanguageRoute>
              <Pricing />
            </LanguageRoute>
          } />
          <Route path="/:lang/analysis" element={
            <LanguageRoute>
              <Analysis />
            </LanguageRoute>
          } />

          {/* Fallback cho bất kỳ route nào khác */}
          <Route path="*" element={<Navigate to={`/${defaultLang}/analysis`} replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;