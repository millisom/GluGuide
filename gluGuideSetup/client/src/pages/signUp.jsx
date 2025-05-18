import React, { useState } from "react";
import axiosInstance from '../api/axiosConfig';
import { Link, useNavigate } from "react-router-dom";
import styles from '../styles/signUp.module.css';

function SignUp() {
    const history = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [message, setMessage] = useState('');

    async function register(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!termsAccepted) {
            alert("Accept the terms and conditions to proceed");
            return;
        }

        try {
            await axiosInstance.post("/signUp", {
                username,
                email,
                password,
                termsAccepted
            })
            .then(res => {
                if (res.data === "exists") {
                    alert("There is already a user account with this email");
                    setMessage("User already exists");
                } else if (res.data === "notexist") {
                    setMessage("Account created successfully");
                    history("/", { state: { id: email } });
                }
            })
            .catch(e => {
                setMessage("An error occurred. Please try again.");
                console.log(e);
            });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={styles.formSignUp}>
            <h1 className={styles.pageTitle}>Sign Up</h1>
            <form onSubmit={register}>
                <div className={styles.inputField}>
                    <input
                        type="text"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputField}>
                    <input
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputField}>
                    <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.inputField}>
                    <input
                        type="password"
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className={styles.input}
                    />
                </div>
                <label className={styles.label}>
                    <input
                        type="checkbox"
                        name="termsAccepted"
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    I accept the Terms and Conditions
                </label>
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.button}>Sign Up</button>
                </div>
                <p>
                    <Link to="/login" className={styles.forgotPassword}>
                        Already have an Account? Login here
                    </Link>
                </p>
            </form>

            {message && (
                <div
                    data-testid={message === "Account created successfully" ? "success-message" : "error-message"}
                    style={{ color: message === "Account created successfully" ? "green" : "red" }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

export default SignUp;
