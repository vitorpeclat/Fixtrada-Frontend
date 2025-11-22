import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config/ip'; // Verifique se este caminho está correto

// Cria uma instância do axios com a URL base do seu backend
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Adiciona um interceptor que é executado ANTES de cada requisição
api.interceptors.request.use(
  async (config) => {
    // Pega o token do usuário que foi salvo no AsyncStorage durante o login
    const token = await AsyncStorage.getItem('userToken');

    // Se o token existir, adiciona ao cabeçalho 'Authorization'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { api };