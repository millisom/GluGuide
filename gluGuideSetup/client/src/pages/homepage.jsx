import { useRef, useState, useEffect } from 'react';
import GlucoseLog from "../components/GlucoseLog";
import AlertForm from "../components/AlertForm";
import AlertsTable from "../components/AlertsTable";
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/Homepage.module.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Homepage = () => {
    const fetchAlertsRef = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [latestPosts, setLatestPosts] = useState([]);
    const [postsError, setPostsError] = useState('');

    const navigate = useNavigate();

    const registerFetchAlerts = (fetchFunction) => {
        fetchAlertsRef.current = fetchFunction;
    };

    const refreshAlerts = () => {
        if (fetchAlertsRef.current) {
            fetchAlertsRef.current();
        }
    };

    useEffect(() => {
        const fetchSessionStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/status`, { credentials: 'include' });
                if (!response.ok) {
                    console.error("Error fetching session status, response not OK:", response.status);
                    setIsLoggedIn(false);
                    return; 
                }
                const data = await response.json();
                setIsLoggedIn(data.valid);
            } catch (err) {
                console.error("Error fetching session status:", err);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchLatestPosts = async () => {
            try {
                const response = await axiosInstance.get('/getAllPosts', { withCredentials: true });
                const sortedPosts = response.data?.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                ) || [];
                setLatestPosts(sortedPosts.slice(0, 3));
            } catch (error) {
                console.error("Error fetching latest posts:", error);
                setPostsError('Failed to load latest blog posts.');
            }
        };

        fetchSessionStatus();
        fetchLatestPosts();
    }, []);

    const handleViewPostClick = (postId) => {
        navigate(`/blogs/view/${postId}`);
    };

    // New handler for tag clicks on the homepage
    const handleHomepageTagClick = (tag) => {
        navigate(`/blogs?tag=${encodeURIComponent(tag)}`);
    };

    if (isLoading) {
        return <div className={styles.loadingPage}>Loading...</div>;
    }

    if (isLoggedIn) {
        return (
            <div className={styles.homepageContainer}>
                <div className={styles.heroSection}>
                    <h1 className={styles.title}>Welcome to GluGuide!</h1>
                    <p className={styles.description}>
                        GluGuide is your trusted platform to track blood sugar levels and receive
                        personalized recommendations. We&apos;re here to help you manage your gestational
                        diabetes with confidence and ease.
                    </p>
                </div>

                <div className={styles.glucoseLogSection}>
                    <h2 className={styles.sectionTitle}>Track Your Glucose</h2>
                    <GlucoseLog />
                </div>

                {/* New combined container for Alerts */}
                <div className={styles.alertsCombinedSection}>
                    <h2 className={styles.sectionTitle}>Manage Your Alerts</h2>
                    <div className={styles.alertsLayoutContainer}>
                        <div className={styles.alertFormWrapper}>
                            <AlertForm fetchAlerts={refreshAlerts} />
                        </div>
                        <div className={styles.alertsTableWrapper}>
                            <AlertsTable registerFetchAlerts={registerFetchAlerts} />
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.homepageContainer}>
                <div className={styles.heroSection}>
                    <h1 className={styles.title}>Welcome to GluGuide!</h1>
                    <p className={styles.description}>
                        Your partner in managing gestational diabetes. Track your glucose, discover helpful insights, and connect with a supportive community.
                    </p>
                </div>

                <section className={styles.featuresOverviewSection}>
                    <h2 className={styles.sectionTitle}>Discover What GluGuide Offers</h2>
                    <ul className={styles.featuresList}>
                        <li>Log your glucose levels with our intuitive tracker.</li>
                        <li>Create and share your experiences through blog posts.</li>
                        <li>Catalog your own meals and recipes for easy logging.</li>
                        <li>Build your public profile and connect with others.</li>
                        <li>Engage with the community by commenting and liking posts.</li>
                        <li>Participate in discussions and share your journey.</li>
                    </ul>
                    <div className={styles.ctaButtonContainer}>
                        <button className={styles.ctaButton} onClick={() => navigate('/signUp')}>
                            Create Your Account
                        </button>
                    </div>
                </section>

                <section className={styles.latestPostsSection}>
                    <h2 className={styles.sectionTitle}>Latest from Our Blog</h2>
                    {postsError && <p className={styles.errorText}>{postsError}</p>}
                    {latestPosts.length > 0 ? (
                        <div className={styles.postsGrid}>
                            {latestPosts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    handleViewClick={() => handleViewPostClick(post.id)}
                                    isAdmin={false}
                                    selectedTags={[]}
                                    setSelectedTags={handleHomepageTagClick}
                                />
                            ))}
                        </div>
                    ) : (
                        !postsError && <p>No blog posts available at the moment. Check back soon!</p>
                    )}
                </section>
            </div>
        );
    }
};

export default Homepage;

