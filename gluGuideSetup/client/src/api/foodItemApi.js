import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/food`;


const axiosConfig = {
  withCredentials: true, // required for session-based user access
};

export const getAllFoodItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAllFoodItems`, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Error fetching all food items:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getFoodItemById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getFoodItemsby/${id}`, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Error fetching food item by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getFoodItemByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/getFoodItemBy/${name}`, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Error fetching food item by name:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addFoodToMeal = async (meal_id, food_id, quantityInGrams) => {
  try {
    const response = await axios.post(`${API_URL}/add-to-meal/${meal_id}`, {
      food_id,
      quantityInGrams
    }, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Error adding food to meal:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const removeFoodFromMeal = async (meal_id, foodItemId) => {
  try {
    const response = await axios.delete(`${API_URL}/remove-from-meal/${meal_id}/food-items/${foodItemId}`, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Error removing food from meal:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateFoodItemQuantity = async (meal_id, foodItemId, quantityInGrams) => {
  try {
    const response = await axios.put(`${API_URL}/update-meal-item/${meal_id}/food-items/${foodItemId}`, {
      quantityInGrams
    }, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Error updating food item quantity:', error.response ? error.response.data : error.message);
    throw error;
  }
};
