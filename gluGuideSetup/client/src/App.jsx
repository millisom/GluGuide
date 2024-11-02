import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import HomePage from './pages/homepage.jsx';
import MyAccount from './pages/myAccount.jsx';
import ContactUs from './pages/contactUs.jsx';
import AboutUs from './pages/aboutUs.jsx';
import LoginPage from './pages/login.jsx';
import SignUp from './pages/signUp.jsx';
import Blogs from './pages/blogs.jsx';



function App() {
    return (
        <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/account" element={<MyAccount />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signUp" element={<SignUp/>} />
                    <Route path="/blogs" element={<Blogs />} />
                </Routes>
        </Router>
    );
}

export default App;
