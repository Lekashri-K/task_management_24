import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EmployeeDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role?.toLowerCase() !== 'employee')) {
      navigate('/unauthorized');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="d-flex justify-content-center mt-5">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Dashboard</h2>
        <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Welcome, {user?.name}</h5>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            You have 3 tasks due this week
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5>My Tasks</h5>
                  <ul className="list-group">
                    <li className="list-group-item">Complete project report</li>
                    <li className="list-group-item">Review design mockups</li>
                    <li className="list-group-item">Team meeting at 2PM</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Quick Links</h5>
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-list-check me-2"></i>View All Tasks
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="bi bi-calendar me-2"></i>My Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;