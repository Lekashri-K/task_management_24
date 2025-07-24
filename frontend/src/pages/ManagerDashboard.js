import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ManagerDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role?.toLowerCase() !== 'manager')) {
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
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 sidebar bg-light p-0">
          <div className="p-3">
            <h5 className="text-center">Team Manager</h5>
          </div>
          <ul className="nav flex-column px-2">
            <li className="nav-item">
              <Link className="nav-link active" to="/manager">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manager/team">
                <i className="bi bi-people me-2"></i>My Team
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manager/projects">
                <i className="bi bi-kanban me-2"></i>Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manager/tasks">
                <i className="bi bi-list-task me-2"></i>Tasks
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 main-content p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Manager Dashboard</h3>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Team Overview</h5>
                </div>
                <div className="card-body">
                  <p>Welcome back, {user?.name}!</p>
                  <div className="alert alert-info">
                    You have 5 pending tasks to approve
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-plus-circle me-2"></i>Create Task
                    </button>
                    <button className="btn btn-outline-secondary">
                      <i className="bi bi-kanban me-2"></i>View Projects
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

export default ManagerDashboard;