import axios from 'axios';

const API_URL = 'http://localhost:8080/food';

const axiosConfig = {
  withCredentials: true, // required for session-based user access
};

export const getAllFoodItems = async () => {
  const response = await axios.get(`${API_URL}/getAllFoodItems`, axiosConfig);
  return response.data;
};

export const getFoodItemById = async (id) => {
  const response = await axios.get(`${API_URL}/getFoodItemsby/${id}`, axiosConfig);
  return response.data;
};

export const getFoodItemByName = async (name) => {
  const response = await axios.get(`${API_URL}/getFoodItemBy/${name}`, axiosConfig);
  return response.data;
};

export const addFoodToMeal = async (meal_id, food_id, quantityInGrams) => {
  const response = await axios.post(`${API_URL}/add-to-meal/${meal_id}`, {
    food_id,
    quantityInGrams
  }, axiosConfig);
  return response.data;
};

export const removeFoodFromMeal = async (meal_id, foodItemId) => {
  const response = await axios.delete(`${API_URL}/remove-from-meal/${meal_id}/food-items/${foodItemId}`, axiosConfig);
  return response.data;
};

export const updateFoodItemQuantity = async (meal_id, foodItemId, quantityInGrams) => {
  const response = await axios.put(`${API_URL}/update-meal-item/${meal_id}/food-items/${foodItemId}`, {
    quantityInGrams
  }, axiosConfig);
  return response.data;
};
