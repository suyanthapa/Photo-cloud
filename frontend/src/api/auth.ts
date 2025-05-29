// src/api/auth.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/auth';


export const registerUser = async (data: { email: string; username: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/register`, data);
  return response.data;
};
