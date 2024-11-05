import React from 'react';
import styles from './CarouselComponent.module.css';

const ItemLast = ({ image, title, description, buttonLabel }) => {
  return (
    <aside className={styles.itemLast}>
      <img loading="lazy" src={image} alt="" className={styles.profileImage} />
      <div className={styles.infoWrapper}>
        <h3 className={styles.infoTitle}>{title}</h3>
        <p className={styles.infoDescription}>{description}</p>
      </div>
      <button className={styles.actionButton}>
        <span className={styles.buttonLabel}>{buttonLabel}</span>
      </button>
    </aside>
  );
};

export default ItemLast;