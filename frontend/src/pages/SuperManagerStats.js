import React, { useEffect, useState } from 'react';
import { superManagerApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

const SuperManagerStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_users: 0,
    active_projects: 0,
    pending_tasks: 0,
    completed_tasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await superManagerApi.getDashboardStats();
        setStats(response);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role?.toLowerCase() === 'supermanager') {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="row mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="col-md-3" key={i}>
            <div className="stat-card p-3 bg-white">
              <div className="placeholder-glow">
                <h6 className="text-muted mb-2 placeholder col-5"></h6>
                <h3 className="mb-0 placeholder col-3"></h3>
                <small className="text-muted placeholder col-7"></small>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="row mb-4">
      {/* Total Users Card */}
      <div className="col-md-3">
        <div className="stat-card p-3 bg-white rounded-3 shadow-sm">
          <div className="d-flex justify-content-between">
            <div>
              <h6 className="text-muted mb-2">Total Users</h6>
              <h3 className="mb-0">{stats.total_users}</h3>
              <small className="text-muted">All registered users</small>
            </div>
            <div className="icon bg-light-primary text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-people fs-5"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects Card */}
      <div className="col-md-3">
        <div className="stat-card p-3 bg-white rounded-3 shadow-sm">
          <div className="d-flex justify-content-between">
            <div>
              <h6 className="text-muted mb-2">Active Projects</h6>
              <h3 className="mb-0">{stats.active_projects}</h3>
              <small className="text-muted">Currently running</small>
            </div>
            <div className="icon bg-light-success text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-kanban fs-5"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks Card */}
      <div className="col-md-3">
        <div className="stat-card p-3 bg-white rounded-3 shadow-sm">
          <div className="d-flex justify-content-between">
            <div>
              <h6 className="text-muted mb-2">Pending Tasks</h6>
              <h3 className="mb-0">{stats.pending_tasks}</h3>
              <small className="text-muted">Awaiting completion</small>
            </div>
            <div className="icon bg-light-warning text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-list-task fs-5"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Tasks Card */}
      <div className="col-md-3">
        <div className="stat-card p-3 bg-white rounded-3 shadow-sm">
          <div className="d-flex justify-content-between">
            <div>
              <h6 className="text-muted mb-2">Completed Tasks</h6>
              <h3 className="mb-0">{stats.completed_tasks}</h3>
              <small className="text-muted">Finished tasks</small>
            </div>
            <div className="icon bg-light-info text-info rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-check-circle fs-5"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperManagerStats;