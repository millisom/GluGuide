import React from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import styles from '../styles/ForgotPassword.module.css';

const ForgotPassword = () => {
    return (
        <div className={styles.forgotPasswordContainer}>
            <h1 className={styles.pageTitle}>Forgot Password</h1>
            <ForgotPasswordForm />
        </div>
    );
};

export default ForgotPassword;
