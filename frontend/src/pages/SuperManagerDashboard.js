import './SuperManagerDashboard.css';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


const SuperManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Strict role verification
  useEffect(() => {
    if (user?.role?.toLowerCase() !== 'supermanager') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Show loading state while verifying
  if (!user) {
    return <div className="d-flex justify-content-center mt-5">Loading...</div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 sidebar p-0">
          <div className="p-4 text-center">
            <h4 className="text-primary fw-bold">TaskFlow</h4>
            <p className="text-muted small">Admin Dashboard</p>
          </div>
          <ul className="nav flex-column px-3">
            <li className="nav-item">
              <Link className="nav-link active" to="/supermanager">
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/users">
                <i className="bi bi-people me-2"></i>Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">
                <i className="bi bi-kanban me-2"></i>Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tasks">
                <i className="bi bi-list-task me-2"></i>Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reports">
                <i className="bi bi-graph-up me-2"></i>Reports
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-10 main-content">
          {/* Header */}
          <div className="header d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Dashboard Overview</h4>
            <div className="d-flex align-items-center">
              <div className="input-group me-3" style={{ width: '250px' }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input type="text" className="form-control border-start-0" placeholder="Search..." />
              </div>
              <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" className="user-avatar me-2" alt="User" />
                  <span className="d-none d-md-inline">{user.name || 'Super Manager'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Profile</Link></li>
                  <li><Link className="dropdown-item" to="/settings"><i className="bi bi-gear me-2"></i>Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="stat-card p-3 bg-white">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Total Users</h6>
                    <h3 className="mb-0">124</h3>
                    <small className="text-success"><i className="bi bi-arrow-up"></i> 12% from last month</small>
                  </div>
                  <div className="icon bg-light-primary text-primary">
                    <i className="bi bi-people"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card p-3 bg-white">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Active Projects</h6>
                    <h3 className="mb-0">18</h3>
                    <small className="text-success"><i className="bi bi-arrow-up"></i> 3 new this week</small>
                  </div>
                  <div className="icon bg-light-success text-success">
                    <i className="bi bi-kanban"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card p-3 bg-white">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Pending Tasks</h6>
                    <h3 className="mb-0">76</h3>
                    <small className="text-danger"><i className="bi bi-arrow-down"></i> 5% from last week</small>
                  </div>
                  <div className="icon bg-light-warning text-warning">
                    <i className="bi bi-list-task"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card p-3 bg-white">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Completed</h6>
                    <h3 className="mb-0">342</h3>
                    <small className="text-success"><i className="bi bi-arrow-up"></i> 22% from last month</small>
                  </div>
                  <div className="icon bg-light-info text-info">
                    <i className="bi bi-check-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Recent Activity */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Recent Activity</h6>
                  <Link to="/activity" className="small">View All</Link>
                </div>
                <div className="card-body">
                  <div className="activity-item">
                    <div className="d-flex justify-content-between">
                      <strong>New user created</strong>
                      <span className="activity-time">10 mins ago</span>
                    </div>
                    <p className="mb-0 text-muted">John Doe (Manager) was added by Admin</p>
                  </div>
                  <div className="activity-item">
                    <div className="d-flex justify-content-between">
                      <strong>Project updated</strong>
                      <span className="activity-time">1 hour ago</span>
                    </div>
                    <p className="mb-0 text-muted">"Website Redesign" deadline extended</p>
                  </div>
                  <div className="activity-item">
                    <div className="d-flex justify-content-between">
                      <strong>Task completed</strong>
                      <span className="activity-time">3 hours ago</span>
                    </div>
                    <p className="mb-0 text-muted">"Homepage Layout" marked as done by Sarah</p>
                  </div>
                  <div className="activity-item">
                    <div className="d-flex justify-content-between">
                      <strong>New project created</strong>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                    <p className="mb-0 text-muted">"Mobile App Development" by Super Manager</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & User Table */}
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">Quick Actions</h6>
                </div>
                <div className="card-body">
                  <div className="row g-2">
                    <div className="col-6">
                      <button className="btn btn-quick-action w-100 text-start p-3">
                        <i className="bi bi-plus-circle me-2 text-primary"></i> Add User
                      </button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-quick-action w-100 text-start p-3">
                        <i className="bi bi-kanban me-2 text-success"></i> Create Project
                      </button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-quick-action w-100 text-start p-3">
                        <i className="bi bi-list-task me-2 text-info"></i> New Task
                      </button>
                    </div>
                    <div className="col-6">
                      <button className="btn btn-quick-action w-100 text-start p-3">
                        <i className="bi bi-file-earmark-text me-2 text-warning"></i> Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Recent Users</h6>
                  <Link to="/users" className="small">View All</Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Status</th>
                       
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <img src="https://randomuser.me/api/portraits/women/44.jpg" className="user-avatar me-2" alt="User" />
                              <span>Sarah Johnson</span>
                            </div>
                          </td>
                          <td><span className="badge bg-primary">Employee</span></td>
                          <td><span className="badge bg-success">Active</span></td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <img src="https://randomuser.me/api/portraits/men/32.jpg" className="user-avatar me-2" alt="User" />
                              <span>Michael Chen</span>
                            </div>
                          </td>
                          <td><span className="badge bg-warning text-dark">Manager</span></td>
                          <td><span className="badge bg-success">Active</span></td>
                         
                        </tr>
                      </tbody>
                    </table>
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

export default SuperManagerDashboard;