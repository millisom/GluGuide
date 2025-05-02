import React from 'react';
import { useParams } from 'react-router-dom';
import RecipeCard from './RecipeCard';

const RecipeCardRoute = () => {
  const { id } = useParams();
  return <RecipeCard recipeId={id} />;
};

export default RecipeCardRoute;
