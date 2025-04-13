import ProfileCard from '../components/ProfileCard';
import styles from '../styles/MyAccount.module.css';
import FoodItem from '../components/loggingFoodItem';

const MyAccount = () => {
    return (
        <div className={styles.myAccount}>
            <div className={styles.profileCardContainer}>
                <ProfileCard />
            </div>
            <FoodItem/>
        </div>
    );
};

export default MyAccount;
