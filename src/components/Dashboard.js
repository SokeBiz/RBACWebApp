import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/api/content');
      const content = response.data.content;
      
      const userStats = {
        totalContent: content.length,
        publicContent: content.filter(item => item.is_public).length,
        privateContent: content.filter(item => !item.is_public).length,
        myContent: content.filter(item => item.author === user.email).length
      };
      
      setStats(userStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin':
        return 'You have full access to manage users, view all data, and configure settings.';
      case 'editor':
        return 'You can create and edit content, but cannot manage users or access admin features.';
      case 'viewer':
        return 'You can only view public content and content you have created.';
      default:
        return 'Unknown role.';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center mt-4">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mt-4">
        <h1>Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-4">
          {getRoleDescription(user.role)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Your Role</h3>
            <span className={`badge badge-${user.role}`}>
              {user.role.toUpperCase()}
            </span>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Total Content</h3>
            <p className="text-2xl font-bold">{stats?.totalContent || 0}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Public Content</h3>
            <p className="text-2xl font-bold">{stats?.publicContent || 0}</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-2">Your Content</h3>
            <p className="text-2xl font-bold">{stats?.myContent || 0}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {user.permissions.map((permission, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">{permission.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card mt-4">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.permissions.includes('view_content') && (
              <div className="p-4 border rounded-lg quick-action-card">
                <h3 className="font-semibold">View Content</h3>
                <p className="text-sm text-gray-600">
                  Browse and read available content
                </p>
                <a href="/content" className="btn btn-primary">
                  View Content
                </a>
              </div>
            )}
            
            {user.permissions.includes('create_content') && (
              <div className="p-4 border rounded-lg quick-action-card">
                <h3 className="font-semibold">Create Content</h3>
                <p className="text-sm text-gray-600">
                  Create new articles and posts
                </p>
                <a href="/create-content" className="btn btn-primary">
                  Create Content
                </a>
              </div>
            )}
            
            {user.permissions.includes('manage_users') && (
              <div className="p-4 border rounded-lg quick-action-card">
                <h3 className="font-semibold">Admin Panel</h3>
                <p className="text-sm text-gray-600">
                  Manage users and system settings
                </p>
                <a href="/admin" className="btn btn-primary">
                  Admin Panel
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
