import CreatePost from "../components/CreatePost";
import React from "react";
import ViewBlogEntries from '../components/ViewBlogEntries';
import StyleSheet from './pages.module.css';

const Blogs = () => {
    return (
        <div className={StyleSheet.blogs}>
            <CreatePost />
            <ViewBlogEntries />
        </div>
    );
}
export default Blogs;