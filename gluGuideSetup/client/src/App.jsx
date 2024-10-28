import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import HomePage from './pages/homepage.jsx';
import MyAccount from './pages/myaccount.jsx';
import ContactUs from './pages/contactUs.jsx';
import AboutUs from './pages/aboutUs.jsx';
import Login from './pages/login.jsx';
import SignUp from './pages/signUp.jsx';
import Blogs from './pages/blogs.jsx';

function App() {
    return (
        <div className="App">
            <header className="App-header"></header>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/account" element={<MyAccount />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signUp" element={<SignUp/>} />
                    <Route path="/blogs" element={<Blogs />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;