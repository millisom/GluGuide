import CreatePost from "../components/CreatePost";
import React from "react";
import StyleSheet from '../styles/Blog.module.css';
import ViewBlogEntries from "../components/ViewBlogEntries";

const Blogs = () => {
    return (
        <div className={StyleSheet.blogs}>
            <CreatePost />
            <ViewBlogEntries />
        </div>
    );
}
export default Blogs;