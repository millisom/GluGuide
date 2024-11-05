import React from 'react';
import styles from './CarouselComponent.module.css';

const Card = ({ image, title, body, buttonText }) => {
  return (
    <article className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.imageWrapper}>
          <img loading="lazy" src={image} alt="" className={styles.cardImage} />
        </div>
        <div className={styles.textContent}>
          <div className={styles.cardBody}>
            <div className={styles.cardText}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{body}</p>
            </div>
            <div className={styles.buttonWrapper}>
              <button className={styles.cardButton}>{buttonText}</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;