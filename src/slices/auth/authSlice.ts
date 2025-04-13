import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { RootState } from 'src/services/store';
import { isRejected, isPending } from '@reduxjs/toolkit';

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

// Вспомогательные функции для обработки успешной и неудачной авторизации
const handleAuthSuccess = (state: TAuthState, user: TUser) => {
  state.user = user;
  state.isAuthChecked = true;
  state.isLoading = false;
  state.error = null;
};

const handleAuthError = (state: TAuthState, error: string) => {
  state.isLoading = false;
  state.error = error;
  state.isAuthChecked = true;
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

// Создание слайса авторизации
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

// Получение данных текущего пользователя
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

// Восстановление пароля
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Меняет статус авторизации
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Авторизация/регистрация
      .addCase(registerUser.fulfilled, (state, action) => {
        handleAuthSuccess(state, action.payload); // Используем хелпер
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        handleAuthSuccess(state, action.payload); // Используем хелпер
      })
      // Сброс данных пользователя
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        handleAuthSuccess(state, action.payload); // Используем хелпер
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isAuthChecked = true; // Проверка завершена, даже если ошибка
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        handleAuthSuccess(state, action.payload); // Используем хелпер
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && isPending(action),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (
          action
        ): action is PayloadAction<unknown, string, any, SerializedError> =>
          action.type.startsWith('auth/') && isRejected(action),
        (state, action) => {
          handleAuthError(state, action.error.message || 'Ошибка авторизации'); // Используем хелпер
        }
      );
  }
});

export const { setAuthChecked } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthChecked = (state: RootState) => state.auth.isAuthChecked;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export default authSlice.reducer;
