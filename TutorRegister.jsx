import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function TutorRegister({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    subjects: '',
    classes: '',
    available_timing: '',
    experience_level: 'Fresher',
    hourly_rate: '',
    comments: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name || !formData.phone || !formData.email || !formData.subjects || !formData.password) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/tutor-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          subjects: formData.subjects.split(',').map(s => s.trim()),
          classes: formData.classes.split(',').map(c => c.trim()),
          available_timing: formData.available_timing,
          experience_level: formData.experience_level,
          hourly_rate: parseFloat(formData.hourly_rate),
          comments: formData.comments,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onLogin(data.token, 'tutor', data.user);
      navigate('/tutor-dashboard');
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
          <h1>Tutor Registration</h1>
          <p className="subtitle">Join our network of verified tutors</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Ahmedabad"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Subjects (comma separated) *</label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="e.g., Maths, Physics, Chemistry"
                  required
                />
              </div>

              <div className="form-group">
                <label>Classes (comma separated)</label>
                <input
                  type="text"
                  name="classes"
                  value={formData.classes}
                  onChange={handleChange}
                  placeholder="e.g., 9-10, 11-12"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Available Timing</label>
                <input
                  type="text"
                  name="available_timing"
                  value={formData.available_timing}
                  onChange={handleChange}
                  placeholder="e.g., Morning, Evening, Weekend"
                />
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                >
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hourly Rate</label>
                <input
                  type="number"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Additional Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Tell us about your teaching approach..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/tutor-login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TutorRegister;
