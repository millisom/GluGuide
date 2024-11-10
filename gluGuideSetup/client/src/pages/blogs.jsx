import CreatePost from "../components/CreatePost";
import React from "react";
import StyleSheet from './pages.module.css';

const Blogs = () => {
    return (
        <div className={StyleSheet.blogs}>
            <CreatePost />
        </div>
    );
}
export default Blogs;