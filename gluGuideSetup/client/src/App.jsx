import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AppRoutes from './routes';

function App() {

  if (import.meta.env.DEV) {
    console.log("Backend URL:", import.meta.env.VITE_API_URL);
  }
  
  return (
    <Router>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </Router>
  );
}




export default App;

