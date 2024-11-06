import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './signup.css';
function SignUp() {
    const history = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

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
        <div className="formSignUp">
            <h1>Sign Up</h1>
            <form onSubmit={register}>
                <div className="inputField">
                    <input
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="input"
                    />
                </div>
                <div className="inputField">
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="input"
                    />
                </div>
                <div className="inputField">
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="input"
                    />
                </div>
                <div className="inputField">
                    <input
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className="input"
                    />
                </div>
                <label className="label">
                    <input
                        type="checkbox"
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        style={{ marginRight: '8px' }}
                    />
                    I accept the Terms and Conditions
                </label>
                <div className="buttonGroup">
                    <button type="submit" className="button">Sign Up</button>
                </div>
                <p><Link to="/login" className="forgotPassword">Already have an Account?Login here</Link></p>
            </form>
        </div>
    );
}

export default SignUp;