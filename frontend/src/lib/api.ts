import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://aura-learn-yl58.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiFormData = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://aura-learn-yl58.onrender.com/api/v1',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
