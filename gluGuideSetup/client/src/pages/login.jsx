import React from "react";
import LoginForm from "../components/LoginForm";
import styles from "../styles/LoginForm.module.css";

const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
        <h1 className={styles.pageTitle}>Welcome Back!</h1>
        <p className={styles.pageDescription}>
            Login to your GluGuide account to track your health journey and explore the latest updates.
        </p>
        <LoginForm />
    </div>
  );
};

export default LoginPage;