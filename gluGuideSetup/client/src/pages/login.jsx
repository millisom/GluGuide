import { Link } from "react-router-dom";
import Login from "../components/LoginForm";
import styles from "./pages.module.css";
import React from "react";

const LoginPage = () => {
    return (
        <div className={styles.loginPage}>
            <Login />
        </div>
    );
}
export default LoginPage;