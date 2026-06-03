import { useState, FormEvent, ChangeEvent } from 'react';
import { authAPI } from '../services/auth';
import { UserLogin, User } from '../types/auth';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [formData, setFormData] = useState<UserLogin>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);

      // Save token to localStorage and set auth header
      localStorage.setItem('token', response.data.access_token);
      authAPI.setAuthHeader(response.data.access_token);

      // Get user info
      const userResponse = await authAPI.getCurrentUser();

      localStorage.setItem('user', JSON.stringify(userResponse.data));
      onLoginSuccess(userResponse.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
