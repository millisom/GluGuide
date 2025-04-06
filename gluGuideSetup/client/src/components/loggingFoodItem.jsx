// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import styles from '../styles/FoodItem.module.css';

// const FoodItem = ({ foodId, onAdd }) => {
//     const [food, setFood] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchFoodItem = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/food/${foodId}`, { withCredentials: true });
//                 setFood(response.data);
//             } catch (error) {
//                 console.error('Error fetching food item:', error.response ? error.response.data : error.message);
//                 setError('Failed to fetch food item.');
//             }
//         };

//         fetchFoodItem();
//     }, [foodId]); // Fetch food item when foodId changes

//     if (error) {
//         return <div className={styles.error}>{error}</div>;
//     }
//     if (!food) {
//         return <div className={styles.loading}>Loading...</div>;
//     }

//     return (
//         <div className={styles.foodItemContainer}>
//             <div className={styles.header}>
//                 <h2 className={styles.foodItemTitle}>{food.foodName}</h2>
//                 <button className={styles.addButton} onClick={() => onAdd(foodId)}>Add</button>
//             </div>
//             <p>Serving: 100 grams</p>
//             <div className={styles.macros}>
//                 <p>Carbs: {food.carbs}g</p>
//                 <p>Protein: {food.protein}g</p>
//                 <p>Fat: {food.fat}g</p>
//             </div>
//         </div>
//     );
// };

// export default FoodItem;
import React from 'react';
import styles from '../styles/FoodItem.module.css';

const FoodItem = ({ onAdd }) => {
    // Mock data
    const food = {
        foodName: 'Apple',
        calories:  52,
        carbs: 14,
        protein: 0.3,
        fat: 0.2,
    };

    return (
        <div className={styles.foodItemContainer}>
            <div className={styles.header}>
                <h2 className={styles.foodItemTitle}>{food.foodName}</h2>
                
                <h2 className={styles.foodItemTitle2}>Serving: 100 grams</h2>
                <button className={styles.addButton} onClick={() => onAdd(food)}>+</button>
                </div>
            <div className={styles.line}></div>
            <div className={styles.macros}>
                <p>Calories: {food.calories} kcal</p>
                <p>Carbs: {food.carbs}g</p>
                <p>Protein: {food.protein}g</p>
                <p>Fat: {food.fat}g</p>
            </div>
        </div>
    );
};

export default FoodItem;