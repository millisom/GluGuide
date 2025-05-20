import { useState } from "react";
import styles from "../styles/ContactUs.module.css";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [successMessage, setSuccessMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage("Thanks for contacting us, we'll get back to you soon!");
        setFormData({
            name: "",
            email: "",
            message: ""
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Contact Us</h1>
            <p className={styles.subtitle}>
                For any queries, please contact us using the form below or reach out directly via email or phone.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        required
                    ></textarea>
                </div>
                <button type="submit" className={styles.submitButton}>Submit</button>
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            </form>
            <div className={styles.contactInfo}>
                <p>Email: <a href="mailto:gluguide01@gmail.com" className={styles.link}>gluguide01@gmail.com</a></p>
                <p>Phone: 123-456-7890</p>
            </div>
        </div>
    );
};

export default ContactUs;
