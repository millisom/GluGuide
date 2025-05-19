import styles from '../styles/AboutUs.module.css';

const AboutUs = () => {
    const currentTeamMembers = [
        {
            name: 'Emili',
            role: 'Project Manager',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/integration-2031395_1920.png',
        },
        {
            name: 'Hossey',
            role: 'Software Architect',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/database-4941338_1920-1.png',
        },
        {
            name: 'Maja',
            role: 'User-Interface Designer',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/laptop-2282328_1920.png',
        },
        {
            name: 'Nilgün',
            role: 'User Stakeholder',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/baby-7318695_1920.jpg',
        },
    ];

    const honorableMentions = [
        {
            name: 'Hafsa',
            role: 'Former Project Manager & Mentor',
            image: 'https://gdewomenhealth.wordpress.com/wp-content/uploads/2024/09/priority-4303707_1920.png',
            note: 'Hafsa was instrumental in the last semester of GluGuide as our Project Manager. She has since moved on to her maternity leave. We honor her foundational work and wish her all the best!',
        },
    ];

    return (
        <div className={styles.aboutUsPageContainer}>
            <div className={styles.contentWrapper}>
                <h1 className={styles.mainTitle}>About GluGuide</h1>

                <section className={styles.introSection}>
                    <p className={styles.description}>
                        Welcome to <strong>GluGuide</strong>, your companion in managing gestational diabetes. Our mission is to develop GluGuide into a helpful resource for women managing gestational diabetes. Each feature, from tracking to reminders, is crafted with care to make life a little easier.
                    </p>
                    <p className={styles.description}>
                        We are a team of computer science students in our second year. Our Vision is to code a webapp to help women with gestational diabetes. We are committed to creating an app that listens to the needs of mothers and provides tools that make managing gestational diabetes less stressful. Documenting our development process helps us stay focused on what truly matters—creating a supportive, reliable app for our users. Along the way, we&apos;re constantly learning and evolving to ensure GluGuide becomes the best it can be.
                    </p>
                </section>
                
                <section className={styles.teamSection}>
                    <h2 className={styles.sectionTitle}>Meet Our Team</h2>
                    <div className={styles.teamGrid}>
                        {currentTeamMembers.map((member, index) => (
                            <div key={`team-${index}`} className={styles.teamCard}>
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
                </section>

                <section className={styles.specialThanksSection}>
                    <h2 className={styles.sectionTitle}>With Special Thanks</h2>
                    <div className={styles.honorableMentionsContainer}>
                        {honorableMentions.map((member, index) => (
                            <div key={`honor-${index}`} className={styles.honorableMentionCard}>
                                <img
                                    src={member.image}
                                    alt={`${member.name}'s profile`}
                                    className={styles.avatar}
                                />
                                <div className={styles.honorableMentionInfo}>
                                    <h3 className={styles.memberName}>{member.name}</h3>
                                    <p className={styles.memberRole}>{member.role}</p>
                                    <p className={styles.honorableMentionNote}>{member.note}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <p className={styles.closingStatement}>
                    Together, our team is passionate about creating a positive impact on maternal health. Thank you for choosing GluGuide!
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
