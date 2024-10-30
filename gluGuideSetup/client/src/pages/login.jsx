import Login from "../components/login";
import { Link } from "react-router-dom";
import React from "react";

const LoginPage = () => {
    return (
        <div className="loginPage">
            <Login />
            <Link to="/signUp">Don't have an account? Sign up here</Link>
        </div>
    );
}
export default LoginPage;