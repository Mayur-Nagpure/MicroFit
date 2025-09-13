import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  CircularProgress
} from '@mui/material';

// Import components
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import ActivityDetail from './components/ActivityDetail';
import WelcomeAnimation from './components/WelcomeAnimation';
// Auth Context
const AuthContext = createContext();

// Auth Provider Component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const keycloakConfig = {
    url: 'http://localhost:8181',
    realm: 'fitness-oauth2',
    clientId: 'oauth2-pkce-client',
    redirectUri: window.location.origin,
  };

  // Initialize auth state
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      // ⚠️ Guard: prevent reusing code
      if (code && state) {
        // Immediately strip code and state from URL to prevent duplicate parsing
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('code');
        cleanUrl.searchParams.delete('state');
        window.history.replaceState({}, document.title, cleanUrl.pathname);

        await handleCallback(code, state);
        return;
      }

      const storedToken = sessionStorage.getItem('access_token');
      if (storedToken) {
        setToken(storedToken);
        await fetchUserInfo(storedToken);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const login = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();

      // Store PKCE params
      sessionStorage.setItem('code_verifier', codeVerifier);
      sessionStorage.setItem('state', state);

      // Build auth URL
      const authUrl = buildAuthUrl(codeChallenge, state);

      // Redirect to Keycloak
      window.location.href = authUrl;
    } catch (err) {
      setError('Login failed: ' + err.message);
      setLoading(false);
    }
  };

  const handleCallback = async (code, state) => {
    try {
      setLoading(true);

      // Verify state
      const storedState = sessionStorage.getItem('state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for token
      const codeVerifier = sessionStorage.getItem('code_verifier');
      const tokenData = await exchangeCodeForToken(code, codeVerifier);

      // Store token and fetch user info
      sessionStorage.setItem('access_token', tokenData.access_token);
      sessionStorage.setItem('refresh_token', tokenData.refresh_token);

      setToken(tokenData.access_token);
      await fetchUserInfo(tokenData.access_token);

      // Clean up URL and storage
      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem('code_verifier');
      sessionStorage.removeItem('state');
    } catch (err) {
      setError('Authentication failed: ' + err.message);
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear();

    const logoutUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(keycloakConfig.redirectUri)}`;
    window.location.href = logoutUrl;
  };

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch(
        `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await response.json();
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Error fetching user info:', err);
      setError('Failed to fetch user information');
    }
  };

  // Helper functions
  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
  };

  const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(new Uint8Array(digest));
  };

  const generateState = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
  };

  const base64URLEncode = (array) => {
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const buildAuthUrl = (codeChallenge, state) => {
    const params = new URLSearchParams({
      client_id: keycloakConfig.clientId,
      redirect_uri: keycloakConfig.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: state,
    });

    return `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth?${params}`;
  };

  const exchangeCodeForToken = async (code, codeVerifier) => {
    const response = await fetch(
      `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: keycloakConfig.clientId,
          code: code,
          redirect_uri: keycloakConfig.redirectUri,
          code_verifier: codeVerifier,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || 'Token exchange failed');
    }

    return response.json();
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Activities Page Component
const ActivitiesPage = () => {
  return (
    <Box sx={{ p: 2, border: '1px dashed grey' }}>
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </Box>
  );
};

// Header Component
function Header() {
  const { user, logout, login, isAuthenticated, loading } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fitness App
        </Typography>

        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : isAuthenticated ? (
          <>
            <Typography sx={{ mr: 2 }}>
              Welcome, {user?.preferred_username || user?.name || user?.email}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={login}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Error Display Component
function ErrorDisplay() {
  const { error } = useAuth();

  if (!error) return null;

  return (
    <Box sx={{
      bgcolor: 'error.light',
      color: 'error.contrastText',
      p: 2,
      mb: 2,
      borderRadius: 1
    }}>
      <Typography variant="subtitle2">Authentication Error:</Typography>
      <Typography variant="body2">{error}</Typography>
    </Box>
  );
}

// Authenticated Routes Component
function AuthenticatedRoutes() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  
  

  const WelcomeScreen = () => (
    <Box sx={{ pt: 6, px: 2, textAlign: 'center' }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 700, color: '#1976d2', letterSpacing: '0.06em' }}
      >
        Welcome! Please Login.
      </Typography>
      
        <WelcomeAnimation />
      
    </Box>
  );


  return (
    <Box component="section" sx={{ p: 2 }}>
      <Routes>
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/activities/:id" element={<ActivityDetail />} />
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/activities" replace />
            ) : (
              <WelcomeScreen />
            )
          }
        />
      </Routes>
    </Box>
  );
}

// Main App Component
export default function App() {
  return (

    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh' }}>
          <Header />

          <Box sx={{ p: 3 }}>
            <ErrorDisplay/>
            <AuthenticatedRoutes />
          </Box>
        </div>
      </Router>
    </AuthProvider>

  );
}