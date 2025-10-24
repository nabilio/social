import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Navigation } from './components/layout/Navigation'
import { HomePage } from './pages/HomePage'
import { SignUpPage } from './pages/SignUpPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { SocialLinksPage } from './pages/SocialLinksPage'
import { PublicProfilePage } from './pages/PublicProfilePage'
import { DiscoverPage } from './pages/DiscoverPage'
import { SettingsPage } from './pages/SettingsPage'
import { MyProfilePage } from './pages/MyProfilePage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { FriendsPage } from './pages/FriendsPage'
import { LegalNoticePage } from './pages/LegalNoticePage'
import { TermsOfUsePage } from './pages/TermsOfUsePage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { CookiePolicyPage } from './pages/CookiePolicyPage'
import { AccessibilityPage } from './pages/AccessibilityPage'
import { AdminPage } from './pages/AdminPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ChooseUsernamePage } from './pages/ChooseUsernamePage'
import { Footer } from './components/layout/Footer'
import { CookieBanner } from './components/ui/CookieBanner'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  // Si l'utilisateur n'a pas de profil, attendre (AuthCallbackPage va le créer)
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    // Si pas de profil, rediriger vers le choix de username (Google OAuth)
    if (!profile) {
      return <Navigate to="/choose-username" />
    }

    if (!profile.onboarding_completed) {
      return <Navigate to="/onboarding" />
    }
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  // Si l'utilisateur n'a pas de profil, attendre (AuthCallbackPage va le créer)
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (profile && profile.onboarding_completed) {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <Routes>
              <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/choose-username" element={<ChooseUsernamePage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard/social-links" element={<ProtectedRoute><SocialLinksPage /></ProtectedRoute>} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/u/:username" element={<PublicProfilePage />} />
              <Route path="/u/:username/:profileSlug" element={<PublicProfilePage />} />
              <Route path="/my/:profileSlug" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
              {/* AuthCallbackPage doit être accessible sans redirection */}
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/legal-notice" element={<LegalNoticePage />} />
              <Route path="/terms-of-use" element={<TermsOfUsePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />
            </Routes>
            <Footer />
            <CookieBanner />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App