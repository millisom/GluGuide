import { lazy } from 'react';

// Lazy load auth-related components
const LoginPage = lazy(() => import('../../pages/login.jsx'));
const SignUp = lazy(() => import('../../pages/signUp.jsx'));
const ForgotPassword = lazy(() => import('../../pages/forgotPassword.jsx'));
const ResetPassword = lazy(() => import('../../pages/resetPassword.jsx'));
const MyAccount = lazy(() => import('../../pages/myAccount.jsx'));

// Export routes as objects
export const authRoutes = [
  { path: "/login", element: LoginPage },
  { path: "/signUp", element: SignUp },
  { path: "/forgotPassword", element: ForgotPassword },
  { path: "/resetPassword/:token", element: ResetPassword },
  { path: "/account", element: MyAccount },
]; 