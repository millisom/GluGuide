import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import HomePage from './pages/homepage.jsx';
import MyAccount from './pages/myAccount.jsx';
import ContactUs from './pages/contactUs.jsx';
import AboutUs from './pages/aboutUs.jsx';
import LoginPage from './pages/login.jsx';
import SignUp from './pages/signUp.jsx';
import Blogs from './pages/blogs.jsx';
import ViewPost from './components/viewPost.jsx';   
import EditPost from './components/editPost.jsx';  
import CreatePost from './pages/createPost.jsx';
import MyBlogs from './pages/myBlogs.jsx';



function App() {
    return (
        <Router>
                <div style={{ paddingTop: '80px' }}> {/* Adjust padding based on navbar height */}
                    <Navbar />
                </div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/account" element={<MyAccount />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signUp" element={<SignUp/>} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blogs/view/:id" element={<ViewPost />} />
                    <Route path="/blogs/edit/:id" element={<EditPost />} />
                    <Route path="/create/post" element={<CreatePost />} />
                    <Route path="/myBlogs" element={<MyBlogs />} />
                </Routes>
        </Router>
    );
}

export default App;
