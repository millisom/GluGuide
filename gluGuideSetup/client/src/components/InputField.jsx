import React from 'react';
import styles from './LoginForm.module.css';

const InputField = ({ label, type }) => {
  return (
    <div className={styles.inputField}>
      <label htmlFor={`${type}Input`} className={styles.label}>
        {label}
      </label>
      <input
        type={type}
        id={`${type}Input`}
        className={styles.input}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default InputField;