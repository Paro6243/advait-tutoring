import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function StudentDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    class_level: '',
    subject: '',
    medium: 'English',
    board: 'CBSE',
    gender_preference: 'Any',
    preferred_timing: '',
    budget: '',
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/student/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/student/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setMessage('Request submitted successfully! We will contact you soon.');
      setFormData({
        class_level: '',
        subject: '',
        medium: 'English',
        board: 'CBSE',
        gender_preference: 'Any',
        preferred_timing: '',
        budget: '',
        comments: '',
      });
      setTimeout(() => fetchRequests(), 1000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user?.name || 'Student'}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === 'new-request' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-request')}
        >
          New Request
        </button>
        <button
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          My Requests
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Your Profile</h2>
            <div className="profile-card">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>Location:</strong> {user?.location}</p>
            </div>
          </div>
        )}

        {activeTab === 'new-request' && (
          <div className="form-section">
            <h2>Submit a New Tutor Request</h2>

            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="request-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Class Level *</label>
                  <select
                    name="class_level"
                    value={formData.class_level}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select class</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                    <option value="5th">5th</option>
                    <option value="6th">6th</option>
                    <option value="7th">7th</option>
                    <option value="8th">8th</option>
                    <option value="9th">9th</option>
                    <option value="10th">10th</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                    <option value="JEE">JEE Preparation</option>
                    <option value="NEET">NEET Preparation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Maths, English, Science"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Medium *</label>
                  <select
                    name="medium"
                    value={formData.medium}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="English">English</option>
                    <option value="Gujarati">Gujarati</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Board *</label>
                  <select
                    name="board"
                    value={formData.board}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="IB">IB</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tutor Gender Preference</label>
                  <select
                    name="gender_preference"
                    value={formData.gender_preference}
                    onChange={handleInputChange}
                  >
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Timing</label>
                  <input
                    type="text"
                    name="preferred_timing"
                    value={formData.preferred_timing}
                    onChange={handleInputChange}
                    placeholder="e.g., Morning, Evening, Weekend"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Budget (Expected Fee)</label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or details..."
                  rows="4"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-section">
            <h2>Your Requests</h2>

            {requests.length === 0 ? (
              <p>You haven't submitted any requests yet.</p>
            ) : (
              <div className="requests-grid">
                {requests.map(req => (
                  <div key={req.id} className="request-card">
                    <div className="card-header">
                      <h3>{req.subject} - {req.class_level}</h3>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status}
                      </span>
                    </div>
                    <p><strong>Medium:</strong> {req.medium}</p>
                    <p><strong>Board:</strong> {req.board}</p>
                    <p><strong>Gender Preference:</strong> {req.gender_preference}</p>
                    <p><strong>Preferred Timing:</strong> {req.preferred_timing || 'Not specified'}</p>
                    <p><strong>Budget:</strong> ₹{req.budget || 'Not specified'}</p>
                    {req.comments && <p><strong>Notes:</strong> {req.comments}</p>}
                    <p className="date">Submitted: {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
