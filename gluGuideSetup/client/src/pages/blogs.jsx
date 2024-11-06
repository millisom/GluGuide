import CreatePost from "../components/CreatePost";
import React from "react";
import ViewPost from '../components/viewPost';
import StyleSheet from './pages.module.css';

const Blogs = () => {
    return (
        <div className={StyleSheet.blogs}>
            <CreatePost />
            <ViewPost />
        </div>
    );
}
export default Blogs;