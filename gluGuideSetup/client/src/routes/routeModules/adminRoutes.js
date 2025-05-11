import { lazy } from 'react';

// Lazy load admin-related components
const AdminDashboard = lazy(() => import('../../pages/AdminDashboard'));
const AdminCreateUser = lazy(() => import('../../pages/AdminCreateUser'));
const AdminEditUser = lazy(() => import('../../pages/AdminEditUser'));
const AdminEditPost = lazy(() => import('../../pages/AdminEditPost'));

// Export routes as objects
export const adminRoutes = [
  { path: "/admin", element: AdminDashboard },
  { path: "/admin/createUser", element: AdminCreateUser },
  { path: "/admin/editUser/:id", element: AdminEditUser },
  { path: "/admin/editPost/:id", element: AdminEditPost },
]; 