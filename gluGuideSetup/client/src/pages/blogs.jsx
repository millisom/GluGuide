import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await axios.put(`http://localhost:5000/api/posts/${editId}`, { title, content });
        } else {
            await axios.post('http://localhost:5000/api/posts', { title, content });
        }
        setTitle('');
        setContent('');
        setIsEditing(false);
        fetchPosts();
    };

    const handleEdit = (post) => {
        setIsEditing(true);
        setEditId(post.id);
        setTitle(post.title);
        setContent(post.content);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/posts/${id}`);
        fetchPosts();
    };

    return (
        <div className="Blog">
            <h1>Blog Posts</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">{isEditing ? 'Update Post' : 'Add Post'}</button>
            </form>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <button onClick={() => handleEdit(post)}>Edit</button>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Blog;
