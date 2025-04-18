import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
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
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/resetPassword.jsx';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreateUser from './pages/AdminCreateUser';
import AdminEditUser from './pages/AdminEditUser';
import Footer from './components/Footer';
import AdminEditPost from './pages/AdminEditPost';
import UserProfile from './components/UserProfile.jsx'; // Import the new component

function App() {
    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/account" element={<MyAccount />} />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signUp" element={<SignUp />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/blogs/view/:id" element={<ViewPost />} />
                        <Route path="/blogs/edit/:id" element={<EditPost />} />
                        <Route path="/create/post" element={<CreatePost />} />
                        <Route path="/myBlogs" element={<MyBlogs />} />
                        <Route path="/viewPost/:id" element={<ViewPost />} />
                        <Route path="/profile/:username" element={<UserProfile />} /> {/* Add this route */}
                        <Route path="/forgotPassword" element={<ForgotPassword />} />
                        <Route path="/resetPassword/:token" element={<ResetPassword />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/createUser" element={<AdminCreateUser />} />
                        <Route path="/admin/editUser/:id" element={<AdminEditUser />} />
                        <Route path="/admin/editPost/:id" element={<AdminEditPost />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

