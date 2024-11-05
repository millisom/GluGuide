import React from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from '../components/profileCard';
import CarouselComponent from '../components/CarouselComponent';

const MyAccount = () => {

    return (
        <div>
            <h1>My Account</h1>
            <ProfileCard />
        </div>

    );
}
export default MyAccount;