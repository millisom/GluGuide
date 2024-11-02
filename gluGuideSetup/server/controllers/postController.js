const Post = require('../models/postModel');

const postController = {
    async getAllPosts(req, res) {
        try {
            const posts = await Post.getAll();
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    async getPostById(req, res) {
        try {
            const post = await Post.getById(req.params.id);
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    async createPost(req, res) {
        try {
            const { title, content } = req.body;
            const post = await Post.create(title, content);
            res.status(201).json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    async updatePost(req, res) {
        try {
            const { title, content } = req.body;
            await Post.update(req.params.id, title, content);
            res.json({ message: 'Post updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    },

    async deletePost(req, res) {
        try {
            await Post.delete(req.params.id);
            res.json({ message: 'Post deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    
};

const fetchPosts = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/posts');
        setPosts(res.data);
        console.log(res.data); // Log the response data to verify it's being fetched
    } catch (error) {
        console.error("Error fetching posts:", error); // Check for any fetch errors
    }
};


module.exports = postController;
