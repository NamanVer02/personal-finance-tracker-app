import apiClient from './apiClient';
import * as Keychain from 'react-native-keychain';
import { Alert } from 'react-native';
import { LoginRequestDTO } from '../interfaces/dto';

export const login = async ( loginRequest ) => {
  try {
    const response = await apiClient.post(
      'api/auth/signin',
      { loginRequest },
      { headers: { skipAuth: true } }
    );

    const {
      accessToken,
      refreshToken,
      tokenType,
      id,
      username: userName,
      email,
      roles,
      twoFactorRequired,
      profileImage,
    } = response.data;

    // Store tokens securely
    await Keychain.setGenericPassword('accessToken', accessToken, {
      service: 'accessToken',
    });
    await Keychain.setGenericPassword('refreshToken', refreshToken, {
      service: 'refreshToken',
    });

    // Optionally, store user info (non-sensitive) in memory or secure storage as needed
    // Avoid storing sensitive info in plain storage

    return {
      ok: true,
      user: {
        id,
        username: userName,
        email,
        roles,
        twoFactorRequired,
        profileImage,
        tokenType,
      },
    };
  } catch (error) {
    let message = 'Login failed. Please try again.';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    Alert.alert('Login Error', message);
    return { ok: false, error: message };
  }
};

export const register = async () => {
  try {
    const response = await apiClient.post(
      'api/auth/signup',
      {  }
    )
  } catch (error) {
    let message = 'Registeration failed. Please try again.';
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    Alert.alert('Registration Error', message);
    return { ok: false, error: message };
  }
}