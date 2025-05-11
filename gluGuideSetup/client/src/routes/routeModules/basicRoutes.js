import { lazy } from 'react';

// Lazy load basic components
const HomePage = lazy(() => import('../../pages/homepage.jsx'));
const ContactUs = lazy(() => import('../../pages/contactUs.jsx'));
const AboutUs = lazy(() => import('../../pages/aboutUs.jsx'));

// Export routes as objects
export const basicRoutes = [
  { path: "/", element: HomePage },
  { path: "/contact", element: ContactUs },
  { path: "/about", element: AboutUs },
]; 