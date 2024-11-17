import React from "react";
import LoginForm from "../components/LoginForm";
import styles from "../styles/LoginForm.module.css";

const LoginPage = () => {
  return (
    <div className={styles.loginContainer}>
        <LoginForm />
    </div>
  );
};

export default LoginPage;