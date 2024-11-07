import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../api/axiosConfig';
import styles from '../styles/LoginForm.module.css';

function SignUp() {
    const history = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

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
            await axios.post("http://localhost:8080/signUp", {
                username,
                email,
                password,
                termsAccepted
            })
            .then(res => {
                if (res.data === "exists") {
                    alert("There is already a user account with this email");
                } else if (res.data === "notexist") {
                    history("/", { state: { id: email } });
                }
            })
            .catch(e => {
                alert("Sign-up failed. Please check your details.");
                console.log(e);
            });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={styles.formLogIn}>
        <h2 className={styles.title}>Sign Up</h2>
        <form onSubmit={register}>
          <div className={styles.label}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.label}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.label}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.label}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className={styles.input}
            />
          </div>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className={styles.checkbox}
            />
            I accept the Terms and Conditions
          </label>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.button}>
              Sign Up
            </button>
          </div>
        </form>
        {notification.message && (
          <p className={notification.type === 'error' ? styles.errorMessage : styles.successMessage}>
            {notification.message}
          </p>
        )}
    </div>
);
}

export default SignUp;