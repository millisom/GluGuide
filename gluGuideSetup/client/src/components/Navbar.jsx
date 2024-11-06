import styles from '../styles/Navbar.module.css';
function Navbar() {
    return (
        <header className={styles.header}>
            <a href="/" className={styles.logo}>GluGuide</a>
        <nav className={styles.navbar}>
            <a href="/">Home</a>
            <a href="/account">My Account</a>
            <a href="/login">Login</a>
            <a href="/signUp">Sign Up</a>
            <a href="/blogs">Blogs</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>


        </nav>
        </header>
    );
}

export default Navbar;