import CreatePost from "../components/CreatePost";
import React from "react";
import ViewBlogEntries from '../components/ViewBlogEntries';

const Blogs = () => {
    return (
        <div className="createBlog">
            <CreatePost />
            <ViewBlogEntries />
        </div>
    );
}
export default Blogs;