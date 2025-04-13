import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData) => {
    const data = await registerUserApi(userData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: TLoginData) => {
    const data = await loginUserApi(userData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

//получает данные текущего пользователя
export const fetchUser = createAsyncThunk('auth/getUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

//восстановление пароля
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string) => {
    await forgotPasswordApi({ email });
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);
