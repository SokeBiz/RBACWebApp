import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/admin/stats')
      ]);
      
      setUsers(usersResponse.data.users);
      setStats(statsResponse.data);
    } catch (error) {
      setError('Failed to load admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'editor':
        return 'badge-editor';
      case 'viewer':
        return 'badge-viewer';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center mt-4">
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error mt-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mt-4">
        <h1>Admin Panel</h1>
        <p className="text-gray-600 mb-4">
          Manage users and view system statistics. Only administrators can access this panel.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Statistics */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
            {stats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-blue-600">{stats.total_users}</h3>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-green-600">{stats.total_content}</h3>
                  <p className="text-sm text-gray-600">Total Content</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-yellow-600">{stats.public_content}</h3>
                  <p className="text-sm text-gray-600">Public Content</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-red-600">{stats.private_content}</h3>
                  <p className="text-sm text-gray-600">Private Content</p>
                </div>
              </div>
            )}
          </div>

          {/* User Management */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <div className="space-y-3">
              {users.map((userItem) => (
                <div key={userItem.email} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{userItem.name}</h3>
                    <p className="text-sm text-gray-600">{userItem.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${getRoleBadgeClass(userItem.role)}`}>
                      {userItem.role}
                    </span>
                    {userItem.email === user.email && (
                      <span className="text-xs text-gray-500">(You)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role Permissions Overview */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">Role Permissions Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="badge badge-admin mr-2">ADMIN</span>
                Administrator
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Manage all users</li>
                <li>• View all data and content</li>
                <li>• Configure system settings</li>
                <li>• Create and edit any content</li>
                <li>• Access admin panel</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="badge badge-editor mr-2">EDITOR</span>
                Content Editor
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create new content</li>
                <li>• Edit own content</li>
                <li>• View public content</li>
                <li>• Cannot manage users</li>
                <li>• Cannot access admin panel</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <span className="badge badge-viewer mr-2">VIEWER</span>
                Content Viewer
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View public content only</li>
                <li>• Cannot create content</li>
                <li>• Cannot edit content</li>
                <li>• Cannot manage users</li>
                <li>• Limited access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Current User</h3>
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {user.name}<br />
                <strong>Email:</strong> {user.email}<br />
                <strong>Role:</strong> {user.role}<br />
                <strong>Permissions:</strong> {user.permissions.length}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Access Control</h3>
              <p className="text-sm text-gray-600">
                This application implements Role-Based Access Control (RBAC) with three distinct user roles. 
                Each role has specific permissions that determine what actions users can perform within the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
