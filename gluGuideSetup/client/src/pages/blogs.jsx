import CreatePost from "../components/CreatePost";
import React from "react";
import styles from '../styles/Blog.module.css';
import ViewBlogEntries from "../components/ViewBlogEntries";

const Blogs = () => {
    return (
        <div className={styles.blogs}>
            <h1 className={styles.pageTitle}>Our Blogs</h1>
            <div className={styles.section}>
                <CreatePost />
            </div>
            <div className={styles.section}>
                <ViewBlogEntries />
            </div>
        </div>
    );
};

export default Blogs;
