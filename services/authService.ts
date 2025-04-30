import apiClient from './apiClient';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, RegisterResponseDTO, User } from '../interfaces/dto';

export const login = async (loginRequest: LoginRequestDTO) => {
  try {
    // Send the fields directly unless your backend expects { loginRequest: { ... } }
    const response = await apiClient.post(
      'api/auth/signin',
      loginRequest,
      { headers: { skipAuth: true } }
    );

    const loginResponse: LoginResponseDTO = response.data;

    // Store tokens securely
    await SecureStore.setItemAsync('accessToken', loginResponse.accessToken);

    // Destructure user fields from loginResponse
    const {
      id,
      username,
      email,
      roles,
      twoFactorRequired,
      profileImage,
      tokenType,
    } = loginResponse;

    const user: User = {
      id,
      username,
      email,
      roles,
      twoFactorRequired,
      profileImage,
      tokenType,
    };

    return {
      ok: true,
      user,
    };
  } catch (error: unknown) {
    let message = 'Login failed. Please try again.';

    // Safe error extraction
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response === 'object' &&
      (error as any).response !== null &&
      'data' in (error as any).response &&
      typeof (error as any).response.data === 'object' &&
      (error as any).response.data !== null &&
      'message' in (error as any).response.data
    ) {
      message = (error as any).response.data.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    Alert.alert('Login Error', message);
    return { ok: false, error: message };
  }
};


export const register = async (registerRequest: RegisterRequestDTO) => {
  
  const formData = new FormData();
  formData.append('username', registerRequest.username);
  formData.append('email', registerRequest.email);
  formData.append('password', registerRequest.password);
  registerRequest.roles.forEach(role => formData.append('roles', role));
  
  if (registerRequest.profileImage !== "") {
    const imageObj = {
      uri: registerRequest.profileImage,
      type: 'image/jpeg',
      name: 'profile.jpg'
    };
    formData.append('profileImage', imageObj as any);
  }
  
  try {
    const response = await apiClient.post(
      'api/auth/signup',
      formData,
      { headers: { skipAuth: true, 'Content-Type': 'multipart/form-data' } }
    );

    const registerResponse: RegisterResponseDTO = response.data

    return {
      ok: true
    }
  } catch (error: unknown) {
    let message = 'Registeration failed. Please try again.';
    // Safe error extraction
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response === 'object' &&
      (error as any).response !== null &&
      'data' in (error as any).response &&
      typeof (error as any).response.data === 'object' &&
      (error as any).response.data !== null &&
      'message' in (error as any).response.data
    ) {
      message = (error as any).response.data.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    Alert.alert('Registration Error', message);
    return { ok: false, error: message };
  }
}