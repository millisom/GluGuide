import { lazy } from 'react';

// Lazy load content-related components
const Blogs = lazy(() => import('../../pages/blogs.jsx'));
const ViewPost = lazy(() => import('../../components/viewPost.jsx'));
const EditPost = lazy(() => import('../../components/editPost.jsx'));
const CreatePost = lazy(() => import('../../pages/createPost.jsx'));
const MyBlogs = lazy(() => import('../../pages/myBlogs.jsx'));
const UserProfile = lazy(() => import('../../components/UserProfile.jsx'));

// Export routes as objects
export const contentRoutes = [
  { path: "/blogs", element: Blogs },
  { path: "/blogs/view/:id", element: ViewPost },
  { path: "/blogs/edit/:id", element: EditPost },
  { path: "/create/post", element: CreatePost },
  { path: "/myBlogs", element: MyBlogs },
  { path: "/viewPost/:id", element: ViewPost },
  { path: "/profile/:username", element: UserProfile },
]; 