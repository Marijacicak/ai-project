import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { LogOut } from 'lucide-react';
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Authentication App
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {user.username}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleLogout}
            startIcon={<LogOut size={16} />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Welcome, {user.username}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Roles: {user.roles.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Backend says: {message}
            </Typography>
          </Paper>

          {!canAccessAdminFeatures(user) && user.roles.includes('user') && (
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                User Features
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Test admin endpoint access (should fail):
              </Typography>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => deleteUser(users[0].id ?? 0)}
              >
                Test DELETE 1st from the list
              </Button>
              {userTestError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  <strong>Error:</strong> {userTestError}
                </Alert>
              )}
            </Paper>
          )}

          <Paper sx={{ p: 3 }}>
            <Typography variant="overline" color="text.secondary">
              USERS
            </Typography>
            <Typography variant="h6" component="h3" gutterBottom>
              All Users
            </Typography>
            {loading ? (
              <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell>Created</TableCell>
                      {isAdmin(user) && <TableCell>Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(userItem => (
                      <TableRow key={userItem.id}>
                        <TableCell>{userItem.id}</TableCell>
                        <TableCell>{userItem.username}</TableCell>
                        <TableCell>{userItem.email}</TableCell>
                        <TableCell>{userItem.roles.join(', ')}</TableCell>
                        <TableCell>
                          {userItem.is_active ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell>
                          {new Date(userItem.created_at).toLocaleDateString()}
                        </TableCell>
                        {isAdmin(user) && (
                          <TableCell>
                            {!userItem.roles.includes('admin') && (
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => deleteUser(userItem.id)}
                              >
                                DELETE
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
