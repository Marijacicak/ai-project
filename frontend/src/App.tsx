import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { isAuthenticated, getCurrentUser, authAPI } from './services/auth';
import { User } from './types/auth';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      const token = localStorage.getItem('token');
      if (token) {
        authAPI.setAuthHeader(token);
      }
      const user = getCurrentUser();
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authAPI.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 2,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h4" component="h1" color="text.primary">
        Authentication App
      </Typography>

      <Paper sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        {showLogin ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Register onRegisterSuccess={handleRegisterSuccess} />
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" component="span">
            {showLogin ? 'No account?' : 'Already have an account?'}{' '}
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? 'Register' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default App;
