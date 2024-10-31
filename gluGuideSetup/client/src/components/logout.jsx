import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();
    

    axios.defaults.withCredentials = true;
    const handleLogout = async () => {
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
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;