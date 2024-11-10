import CreatePost from "../components/CreatePost";
import React from "react";
import StyleSheet from './pages.module.css';
import ViewBlogEntries from "../components/ViewBlogEntries";

const Blogs = () => {
    return (
        <div className={StyleSheet.blogs}>
            <CreatePost />
        </div>
    );
}
export default Blogs;