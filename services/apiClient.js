import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'http://192.168.127.180:8080',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
    async (config) => {
      if (config.headers && config.headers.skipAuth) {
        // Remove the skipAuth flag before sending
        delete config.headers.skipAuth;
        return config;
      }
      // Attach token as usual
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default apiClient;
