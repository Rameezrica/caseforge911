import axios from 'axios';
import { User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createUserProfile = async (firebaseUser: any): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/users/profile`, {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
      photoURL: firebaseUser.photoURL,
      isGoogleUser: !!firebaseUser.providerData[0]?.providerId.includes('google')
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/users/profile/${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<User> => {
  try {
    const response = await axios.patch(`${API_URL}/users/profile/${uid}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 