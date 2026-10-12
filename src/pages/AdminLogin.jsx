import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminLogin({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLogin(data.token, 'admin', data.user);
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Admin Login</h1>
          <p className="subtitle">Advait Management Portal</p>

          {error && <div className="error-message">{error}</div>}

          <div className="test-credentials" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <p style={{ margin: '5px 0', fontSize: '12px' }}>
              <strong>Test Credentials:</strong>
            </p>
            <p style={{ margin: '5px 0', fontSize: '12px' }}>Email: admin@advait.com</p>
            <p style={{ margin: '5px 0', fontSize: '12px' }}>Password: admin123</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Admin email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Admin password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          <p className="auth-footer">
            <Link to="/">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
