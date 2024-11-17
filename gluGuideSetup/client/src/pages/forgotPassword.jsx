import React from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import styles from '../styles/ForgotPassword.module.css';

const ForgotPassword = () => {
    return (
        <div className={styles.forgotPasswordContainer}>
            <ForgotPasswordForm />
        </div>
    );
};

export default ForgotPassword;
