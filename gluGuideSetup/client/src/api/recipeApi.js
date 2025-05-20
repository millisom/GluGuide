import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/recipes`;


const axiosConfig = {
  withCredentials: true,
};
export const getAllRecipes = async () => {
  const response = await axios.get(`${API_URL}/recipes`, axiosConfig);
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await axios.get(`${API_URL}/recipes/${id}`, axiosConfig);
  return response.data;
};

export const getRecipeByName = async (name) => {
  const response = await axios.get(`${API_URL}/recipes/search/name?name=${encodeURIComponent(name)}`, axiosConfig);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const response = await axios.post(`${API_URL}/recipes`, recipeData, axiosConfig);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const response = await axios.put(`${API_URL}/recipes/${id}`, recipeData, axiosConfig);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await axios.delete(`${API_URL}/recipes/${id}`, axiosConfig);
  return response.data;
};

export const logRecipe = async (data) => {
  const response = await axios.post(`${API_URL}/recipes/log`, data, axiosConfig);
  return response.data;
};

export const getRecipeLogs = async (user_id) => {
  const response = await axios.get(`${API_URL}/recipes/logs/${user_id}`, axiosConfig);
  return response.data;
};

export const deleteRecipeLog = async (logId) => {
  const response = await axios.delete(`${API_URL}/logs/${logId}`, axiosConfig);
  return response.data;
};
