import React from 'react';
import styles from '../styles/AboutUs.module.css';

const AboutUs = () => {
    const teamMembers = [
        {
            name: 'Hafsa',
            role: 'Project Manager',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/priority-4303707_1920.png',
        },
        {
            name: 'Emili',
            role: 'Integrator',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/integration-2031395_1920.png',
        },
        {
            name: 'Hossay',
            role: 'Application & Database Architect',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/database-4941338_1920-1.png',
        },
        {
            name: 'Maja',
            role: 'User-Interface Designer',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/laptop-2282328_1920.png',
        },
        {
            name: 'Sanna',
            role: 'User Stakeholder',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/baby-7318695_1920.jpg',
        },
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>About Us</h1>
            <p className={styles.description}>
                Welcome to <strong>GluGuide</strong>, your companion in managing gestational diabetes. Our mission is to develop GluGuide into a helpful resource for women managing gestational diabetes. Each feature, from tracking to reminders, is crafted with care to make life a little easier.
            </p>
            <p className={styles.description}>
                We are committed to creating an app that listens to the needs of mothers and provides tools that make managing gestational diabetes less stressful. Documenting our development process helps us stay focused on what truly matters—creating a supportive, reliable app for our users. Along the way, we’re constantly learning and evolving to ensure GluGuide becomes the best it can be.
            </p>
            <h2 className={styles.subtitle}>Meet the Team</h2>
            <div className={styles.teamGrid}>
                {teamMembers.map((member, index) => (
                    <div key={index} className={styles.teamCard}>
                        <img
                            src={member.image}
                            alt={`${member.name}'s profile`}
                            className={styles.avatar}
                        />
                        <h3 className={styles.memberName}>{member.name}</h3>
                        <p className={styles.memberRole}>{member.role}</p>
                    </div>
                ))}
            </div>
            <p className={styles.teamDescription}>
                Together, our team is passionate about creating a positive impact on maternal health. Thank you for choosing GluGuide!
            </p>
        </div>
    );
};

export default AboutUs;
