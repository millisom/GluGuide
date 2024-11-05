import React from 'react';
import styles from './CarouselComponent.module.css';
import Card from './Card';
import ItemLast from './ItemLast';

const CarouselComponent = () => {
  const cards = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/867c181a2092bf1a6bad3d6f1524b6db8a352cabf134511e7ba0b94932bcaaac?placeholderIfAbsent=true&apiKey=e3d94bc6bfb94cf6938063a2f1ab4304",
      title: "Title",
      body: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
      buttonText: "Button"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/867c181a2092bf1a6bad3d6f1524b6db8a352cabf134511e7ba0b94932bcaaac?placeholderIfAbsent=true&apiKey=e3d94bc6bfb94cf6938063a2f1ab4304",
      title: "Title",
      body: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
      buttonText: "Button"
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/867c181a2092bf1a6bad3d6f1524b6db8a352cabf134511e7ba0b94932bcaaac?placeholderIfAbsent=true&apiKey=e3d94bc6bfb94cf6938063a2f1ab4304",
      title: "Title",
      body: "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
      buttonText: "Button"
    }
  ];

  return (
    <section className={styles.carouselWrapper}>
      <div className={styles.carousel}>
        <div className={styles.cardGridContentList}>
          <h2 className={styles.carouselHeading}>Heading</h2>
          <div className={styles.cardsContainer}>
            {cards.map((card, index) => (
              <Card key={index} {...card} />
            ))}
          </div>
        </div>
        <ItemLast
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/f812d00fa10ad6f4a739ec8ea709cf8334ec303533f52d5a03fc4ad67ce8617c?placeholderIfAbsent=true&apiKey=e3d94bc6bfb94cf6938063a2f1ab4304"
          title="Title"
          description="Description"
          buttonLabel="Label"
        />
      </div>
    </section>
  );
};

export default CarouselComponent;