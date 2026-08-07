import axios, { InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';

const attachToken = async (config: InternalAxiosRequestConfig) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://aura-learn-yl58.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(attachToken, (error) => Promise.reject(error));

export const apiFormData = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://aura-learn-yl58.onrender.com/api/v1',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

apiFormData.interceptors.request.use(attachToken, (error) => Promise.reject(error));
