import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px' }}>👑 Admin Dashboard</h1>

            <section style={{ marginBottom: '30px' }}>
                <h2>User Management 👤</h2>
                <ul>
                    <li><Link to="/admin/users">📋 View All Users</Link></li>
                    <li><Link to="/admin/createUser">✨ Create New User</Link></li>
                </ul>
            </section>

            <section style={{ marginBottom: '30px' }}>
                <h2>Post Management 📑</h2>
                <ul>
                    <li><Link to="/admin/posts">📋 View & Manage Posts</Link></li>
                </ul>
            </section>

            <section style={{ marginBottom: '30px' }}>
                <h2>Comment Management 💬</h2>
                <ul>
                    <li><Link to="/admin/comments">📋 View & Manage Comments</Link></li>
                </ul>
            </section>
        </div>
    );
};

export default AdminDashboard;
