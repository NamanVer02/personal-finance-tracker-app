import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
  baseURL: 'http://192.168.127.180:8080',
  // baseURL: 'http://10.108.19.197:8080',
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // If skipAuth, don't attach token
    if (config.headers && config.headers.skipAuth) {
      delete config.headers.skipAuth;
      return config;
    }
    // Attach Authorization token if available
    const token = await SecureStore.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If Content-Type is not set, default to application/json
    if (!config.headers || !config.headers['Content-Type']) {
      config.headers = config.headers || {};
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
