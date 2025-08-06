// src/api/auth.js
import axios from 'axios';

import { instance } from './reminder_api';

export const loginUser = async (credentials) => {
  return instance.post('/login', credentials); 
};

export const signupUser = async (userData) => {
  return instance.post('/signup', userData); 
};
