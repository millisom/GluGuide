import { Suspense } from 'react';
import Navbar from '../Navbar.jsx';
import Footer from '../Footer';

// Simple loading component
const Loading = () => (
  <div className="loading-spinner">Loading...</div>
);

const AppLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout; 