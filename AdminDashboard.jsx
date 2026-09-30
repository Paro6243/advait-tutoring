import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [stats, setStats] = useState({ total_requests: 0, assigned_requests: 0, total_revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch requests
      const reqRes = await fetch(`${API_URL}/api/admin/requests`, { headers });
      const reqData = await reqRes.json();
      setRequests(reqData);

      // Fetch tutors
      const tutRes = await fetch(`${API_URL}/api/admin/tutors`, { headers });
      const tutData = await tutRes.json();
      setTutors(tutData);

      // Fetch stats
      const statsRes = await fetch(`${API_URL}/api/admin/stats`, { headers });
      const statsData = await statsRes.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTutor = async (requestId, tutorId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/assign-tutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ request_id: requestId, tutor_id: tutorId }),
      });

      if (response.ok) {
        alert('Tutor assigned successfully!');
        fetchData();
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error assigning tutor:', error);
      alert('Error assigning tutor');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1>Advait Admin Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Admin: {user?.name || 'User'}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <h3>Total Requests</h3>
          <p className="stat-value">{stats.total_requests}</p>
        </div>
        <div className="stat-card">
          <h3>Assigned</h3>
          <p className="stat-value">{stats.assigned_requests}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.total_revenue.toLocaleString()}</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Student Requests
        </button>
        <button
          className={`tab ${activeTab === 'tutors' ? 'active' : ''}`}
          onClick={() => setActiveTab('tutors')}
        >
          Tutors ({tutors.length})
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {activeTab === 'requests' && (
          <div className="requests-section">
            <h2>Student Requests Management</h2>

            {/* Filter */}
            <div className="filter-bar">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({requests.length})
              </button>
              <button
                className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
                onClick={() => setFilter('new')}
              >
                New ({requests.filter(r => r.status === 'new').length})
              </button>
              <button
                className={`filter-btn ${filter === 'assigned' ? 'active' : ''}`}
                onClick={() => setFilter('assigned')}
              >
                Assigned ({requests.filter(r => r.status === 'assigned').length})
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="requests-table">
                {filteredRequests.length === 0 ? (
                  <p>No requests found</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Subject</th>
                        <th>Class</th>
                        <th>Medium</th>
                        <th>Board</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map(req => (
                        <tr key={req.id}>
                          <td>{req.students?.name || 'Unknown'}</td>
                          <td>{req.subject}</td>
                          <td>{req.class_level}</td>
                          <td>{req.medium}</td>
                          <td>{req.board}</td>
                          <td>
                            <span className={`status-badge status-${req.status}`}>
                              {req.status}
                            </span>
                          </td>
                          <td>{new Date(req.created_at).toLocaleDateString()}</td>
                          <td>
                            {req.status === 'new' && (
                              <button
                                className="btn btn-small"
                                onClick={() => setSelectedRequest(req)}
                              >
                                Assign
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tutors' && (
          <div className="tutors-section">
            <h2>Tutors Directory</h2>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="tutors-table">
                {tutors.length === 0 ? (
                  <p>No tutors found</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Experience</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tutors.map(tutor => (
                        <tr key={tutor.id}>
                          <td>{tutor.name}</td>
                          <td>{tutor.phone}</td>
                          <td>{tutor.email}</td>
                          <td>{tutor.location}</td>
                          <td>{tutor.experience_level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Assigning Tutor */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Assign Tutor to Request</h2>
            <p><strong>Student:</strong> {selectedRequest.students?.name}</p>
            <p><strong>Subject:</strong> {selectedRequest.subject}</p>
            <p><strong>Class:</strong> {selectedRequest.class_level}</p>
            <p><strong>Gender Preference:</strong> {selectedRequest.gender_preference}</p>

            <div className="tutor-list">
              <h3>Select a Tutor:</h3>
              {tutors.map(tutor => (
                <div
                  key={tutor.id}
                  className="tutor-option"
                  onClick={() => handleAssignTutor(selectedRequest.id, tutor.id)}
                >
                  <strong>{tutor.name}</strong> - {tutor.experience_level}
                  <br />
                  <small>Phone: {tutor.phone}</small>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedRequest(null)}
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
