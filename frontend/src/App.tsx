import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ProtectedRoute } from './components';
import { LoginPage, RegisterPage } from './features/auth';
import { OnboardingPage } from './features/onboarding';
import { DashboardPage } from './features/dashboard';
import { LandingPage } from './features/landing';
import { CreateOrderPage } from './features/orders';
import { ProfilePage, CreateProfilePage } from './features/profile';
import { MessagesPage } from './features/messages';
import { useAuth } from './features/auth/hooks/useAuth';

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Landing page for guests (no layout) */}
      <Route
        path="/"
        element={
          <GuestRoute>
            <LandingPage />
          </GuestRoute>
        }
      />

      {/* Auth routes (no layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-profile"
        element={
          <ProtectedRoute>
            <CreateProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Main layout routes with header */}
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Redirect old routes */}
      <Route path="/swipe" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
