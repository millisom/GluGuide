import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import styles from '../styles/BlogCard.module.css';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
    }, []);

    const handleLogout = async () => {
        console.log('handleLogout called');
        try {
            await axios.get('http://localhost:8080/logout');
            console.log('Session destroyed');
            navigate('/login');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button className={styles.cardButton} onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
