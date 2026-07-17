import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './features/notification/components/NotificationToast';
import PushPermissionPrompt from './features/notification/components/PushPermissionPrompt';
import Loader from './components/ui/Loader';
import './App.css'

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Home = lazy(() => import('./pages/Home'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const BlogForm = lazy(() => import('./pages/BlogForm'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NotificationPreferences = lazy(() => import('./pages/NotificationPreferences'));
const NotFound = lazy(() => import('./pages/NotFound'));
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/ToastContainer';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <Loader />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center mt-5">
        <Loader />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Home />} />
        <Route path="/blogs/new" element={
          <ProtectedRoute>
            <BlogForm />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/blogs/:id/edit" element={
          <ProtectedRoute>
            <BlogForm />
          </ProtectedRoute>
        } />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/users/:id/edit" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/preferences" element={
          <ProtectedRoute>
            <NotificationPreferences />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

// Temporary Maintenance Component
function Maintenance() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', color: '#212529' }}>
      <div style={{ maxWidth: '600px', padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#0d6efd' }}>Temporarily Unavailable</h1>
        <p style={{ fontSize: '1.1rem', color: '#495057', lineHeight: '1.6', marginBottom: '15px' }}>
          I'm migrating the backend to a new cloud environment. While this is in progress, the application is temporarily unavailable.
        </p>
        <p style={{ fontSize: '1.1rem', color: '#495057', lineHeight: '1.6' }}>
          Thanks for your patience. I expect everything to be back online soon.
        </p>
        <a href="https://www.linkedin.com/in/nimishkumar07/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', color: '#0d6efd', lineHeight: '1.6' }}>
          <p style={{ fontSize: '1.1rem', color: '#0d6efd', lineHeight: '1.6' }}>Connect on LinkedIn</p>
        </a>
      </div>
    </div>
  );
}

// Rename original App to OriginalApp temporarily
function OriginalApp() {
  return (
    <Router>
      <ToastProvider>
        <ScrollToTop />
        <AuthProvider>
          <NotificationProvider>
            <ToastContainer />
            <Navbar />
            <NotificationToast />
            <PushPermissionPrompt />
            <div style={{ flex: 1, width: '100%' }}>
              <AppRoutes />
            </div>
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

function App() {
  // Toggle this boolean to switch between maintenance mode and the actual app
  const isMaintenanceMode = true; 
  
  if (isMaintenanceMode) {
    return <Maintenance />;
  }
  
  return <OriginalApp />;
}

export default App
