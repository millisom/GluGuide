import axios from 'axios';

const API_URL = 'http://localhost:8080/meal';

const axiosConfig = {
  withCredentials: true, // 🔐 important for session cookies
};

export const createMeal = async (mealData) => {
  const response = await axios.post(`${API_URL}/createMeal`, mealData, axiosConfig);
  return response.data;
};

export const getMealById = async (id) => {
  const response = await axios.get(`${API_URL}/getMealBy/${id}`, axiosConfig);
  return response.data;
};

export const getAllMealsForUser = async (user_id) => {
  const response = await axios.post(`${API_URL}/getAllMealsFor/user`, {}, axiosConfig);
  return response.data;
};

export const recalculateMealNutrition = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/recalculate`, null, axiosConfig);
  return response.data;
};

export const deleteMeal = async (id) => {
  const response = await axios.delete(`${API_URL}/deleteMeal/${id}`, axiosConfig);
  return response.data;
};
