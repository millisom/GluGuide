import React from 'react';
import styles from '../styles/LoginForm.module.css';

const Button = ({ children }) => {
  return (
    <button type="submit" className={styles.button}>
      {children}
    </button>
  );
};

export default Button;