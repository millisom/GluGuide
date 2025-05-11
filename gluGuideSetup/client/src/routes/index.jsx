import { Routes, Route } from 'react-router-dom';
import { basicRoutes } from './routeModules/basicRoutes';
import { authRoutes } from './routeModules/authRoutes';
import { contentRoutes } from './routeModules/contentRoutes';
import { adminRoutes } from './routeModules/adminRoutes';
import { healthRoutes } from './routeModules/healthRoutes';

/**
 * Main routes component with modular organization
 * Uses route objects from separate modules to reduce coupling
 */
const AppRoutes = () => {
  // Helper function to render route components
  const renderRoutes = (routes) => {
    return routes.map(route => (
      <Route 
        key={route.path} 
        path={route.path} 
        element={<route.element />} 
      />
    ));
  };

  return (
    <Routes>
      {/* Basic Routes */}
      {renderRoutes(basicRoutes)}
      
      {/* Auth Routes */}
      {renderRoutes(authRoutes)}
      
      {/* Content Routes */}
      {renderRoutes(contentRoutes)}
      
      {/* Admin Routes */}
      {renderRoutes(adminRoutes)}
      
      {/* Health Routes */}
      {renderRoutes(healthRoutes)}
    </Routes>
  );
};

export default AppRoutes; 