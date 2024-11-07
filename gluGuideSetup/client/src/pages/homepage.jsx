import React from 'react';
import ResetPasswordForm from "../components/ResetPasswordForm";
import ForgotPasswordForm from '../components/ForgotPasswordForm';
const Homepage = () => {

    return (
        <div className="page-container">
            <ResetPasswordForm />
        <h1>Welcome to GluGuide!</h1>

        <p>
            GluGuide is a platform that helps you keep track of your blood sugar
            levels and provides you with personalized recommendations to help you
            manage your diabetes.
        </p>
        <p>
            To get started, please sign up or log in.
        </p>
        <ForgotPasswordForm />
        </div>
    );
}
export default Homepage;