import React from 'react';
import postList from '../components/postList'
import createPost from '../components/createPost';


const Blogs = () => {
    return (
        <div>
            <createPost />
            <postList />
        </div>
    );
}
export default Blogs;