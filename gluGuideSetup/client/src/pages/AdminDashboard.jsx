import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-links">
        <Link to="/admin/users">User Management</Link>
        <Link to="/admin/posts">Post Management</Link>
        <Link to="/admin/comments">Comment Management</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
