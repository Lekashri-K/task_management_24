// SuperManagerDashboard.js
import './SuperManagerDashboard.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SuperManagerStats from './SuperManagerStats';
import QuickActions from './QuickActions';
import { superManagerApi } from '../api/api';

const SuperManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch tasks function
  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const data = await superManagerApi.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Fetch projects function
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await superManagerApi.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch recent users function
  const fetchRecentUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await superManagerApi.getUsers();
      setRecentUsers(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Strict role verification and data loading
  useEffect(() => {
    if (user?.role?.toLowerCase() !== 'supermanager') {
      navigate('/login');
    } else {
      fetchTasks();
      fetchProjects();
      fetchRecentUsers();
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

          <SuperManagerStats />

          <div className="row">
            {/* Recent Activity */}
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Recent Activity</h6>
                  <Link to="/activity" className="small">View All</Link>
                </div>
                <div className="card-body">
                  {tasks.slice(0, 4).map((task) => (
                    <div className="activity-item" key={task.id}>
                      <div className="d-flex justify-content-between">
                        <strong>{task.title}</strong>
                        <span className="activity-time">
                          {new Date(task.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="mb-0 text-muted">
                        Status: {task.status} | Due: {task.due_date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & User Table */}
            <div className="col-md-6">
              <QuickActions 
                refreshTasks={fetchTasks}
                refreshProjects={fetchProjects}
                refreshUsers={fetchRecentUsers}
              />

              <div className="card mt-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Recent Users</h6>
                  <Link to="/users" className="small">View All</Link>
                </div>
                <div className="card-body p-0">
                  {loadingUsers ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
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
                          {recentUsers.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={`https://randomuser.me/api/portraits/${user.gender === 'female' ? 'women' : 'men'}/${user.id % 100}.jpg`}
                                    className="user-avatar me-2" 
                                    alt="User" 
                                  />
                                  <span>{user.name}</span>
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${
                                  user.role === 'manager' ? 'bg-warning text-dark' : 'bg-primary'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-success">Active</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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