import { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { isAuthenticated, getCurrentUser, authAPI } from './services/auth';
import { User } from './types/auth';
import './App.css';

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
    return <div>Loading...</div>;
  }

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Authentication App</h1>

        {showLogin ? (
          <div>
            <Login onLoginSuccess={handleLoginSuccess} />
            <p>
              No account?{' '}
              <button onClick={() => setShowLogin(false)}>Register</button>
            </p>
          </div>
        ) : (
          <div>
            <Register onRegisterSuccess={handleRegisterSuccess} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setShowLogin(true)}>Login</button>
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
