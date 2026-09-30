import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function TutorDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailableRequests();
    } else if (activeTab === 'applications') {
      fetchMyApplications();
    }
  }, [activeTab]);

  const fetchAvailableRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tutor/available-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAvailableRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tutor/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMyApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRequest = async (requestId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tutor/apply-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ request_id: requestId }),
      });

      if (response.ok) {
        setMessage('Applied successfully! We will notify you if selected.');
        setTimeout(() => setMessage(''), 3000);
        fetchAvailableRequests();
      }
    } catch (error) {
      setMessage('Error applying for this request');
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
        <h1>Tutor Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user?.name || 'Tutor'}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Requests
        </button>
        <button
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          My Applications
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {message && <div className="success-message">{message}</div>}

        {activeTab === 'available' && (
          <div className="requests-section">
            <h2>Available Tutor Requests</h2>
            <p className="subtitle">Browse and apply for student requests</p>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {availableRequests.length === 0 ? (
                  <p>No available requests at the moment. Check back soon!</p>
                ) : (
                  <div className="requests-grid">
                    {availableRequests.map(req => (
                      <div key={req.id} className="request-card">
                        <div className="card-header">
                          <h3>{req.subject} - {req.class_level}</h3>
                          <span className="posted">Posted {new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                        <p><strong>Medium:</strong> {req.medium}</p>
                        <p><strong>Board:</strong> {req.board}</p>
                        <p><strong>Gender Preference:</strong> {req.gender_preference}</p>
                        <p><strong>Preferred Timing:</strong> {req.preferred_timing || 'Flexible'}</p>
                        <p><strong>Student Budget:</strong> ₹{req.budget || 'Not specified'}</p>
                        {req.comments && <p><strong>Comments:</strong> {req.comments}</p>}
                        
                        <button
                          className="btn btn-primary"
                          onClick={() => handleApplyRequest(req.id)}
                          disabled={loading}
                        >
                          Apply for this Request
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="requests-section">
            <h2>My Applications</h2>
            <p className="subtitle">Track your applications and their status</p>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {myApplications.length === 0 ? (
                  <p>You haven't applied for any requests yet.</p>
                ) : (
                  <div className="requests-grid">
                    {myApplications.map(app => (
                      <div key={app.id} className="request-card">
                        <div className="card-header">
                          <h3>
                            {app.student_requests?.subject} - {app.student_requests?.class_level}
                          </h3>
                          <span className={`status-badge status-${app.status}`}>
                            {app.status}
                          </span>
                        </div>
                        <p><strong>Medium:</strong> {app.student_requests?.medium}</p>
                        <p><strong>Board:</strong> {app.student_requests?.board}</p>
                        <p><strong>Applied On:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                        <p className="status-text">
                          {app.status === 'pending' && 'Waiting for admin approval'}
                          {app.status === 'accepted' && 'Congratulations! You have been selected'}
                          {app.status === 'rejected' && 'Unfortunately, you were not selected'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorDashboard;
