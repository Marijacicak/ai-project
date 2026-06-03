import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { User } from '../types/auth';
import { canAccessAdminFeatures, isAdmin } from '../utils/roleUtils';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [userTestError, setUserTestError] = useState('');

  const fetchProtectedData = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_URL}/hello`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      // Handle error silently or show user feedback
    }
  };

  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      // Handle error silently or show user feedback
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = async (userId: number) => {
    try {
      setUserTestError('');
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await axios.delete(`${API_URL}/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserTestError('');
      fetchAllUsers();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      setUserTestError(
        axiosError.response?.data?.detail || 'Failed to access delete endpoint'
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  useEffect(() => {
    fetchProtectedData();
    fetchAllUsers();
  }, [user, fetchAllUsers]);

  return (
    <div className="dashboard">
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      <p>Roles: {...user.roles}</p>
      <p>Backend says: {message}</p>

      {!canAccessAdminFeatures(user) && user.roles.includes('user') && (
        <div className="user-section">
          <h3>User Features</h3>
          <p>Test admin endpoint access (should fail):</p>
          <button onClick={() => deleteUser(users[0].id ?? 0)}>
            Test DELETE 1st from the list
          </button>
          {userTestError && (
            <div className="error-message">
              <p>
                <strong>Error:</strong> {userTestError}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="admin-section">
        <h3>USERS</h3>

        <div className="users-table">
          <h4>All Users</h4>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Active</th>
                  <th>Created</th>
                  {isAdmin(user) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map(userItem => (
                  <tr key={userItem.id}>
                    <td>{userItem.id}</td>
                    <td>{userItem.username}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.roles.join(', ')}</td>
                    <td>{userItem.is_active ? 'Yes' : 'No'}</td>
                    <td>
                      {new Date(userItem.created_at).toLocaleDateString()}
                    </td>
                    {isAdmin(user) && (
                      <td>
                        {!userItem.roles.includes('admin') && (
                          <button onClick={() => deleteUser(userItem.id)}>
                            DELETE
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
