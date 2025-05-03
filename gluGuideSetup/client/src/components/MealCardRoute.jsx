import React from 'react';
import { useParams } from 'react-router-dom';
import MealCard from './MealCard'; // adjust path if needed

const MealCardRoute = () => {
  const { mealId } = useParams();

  return <MealCard mealId={mealId} />;
};

export default MealCardRoute;
