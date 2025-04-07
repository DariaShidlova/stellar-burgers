import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isRejected
} from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  getIngredientsApi,
  orderBurgerApi,
  getFeedsApi,
  getOrdersApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getOrderByNumberApi
} from '../utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '../utils/cookie';
import { v4 as uuidv4 } from 'uuid';

import { TIngredient, TOrder, TOrdersData, TUser } from '../utils/types';
import { RootState } from 'src/services/store';

type TConstructorIngredient = TIngredient & { uniqueId: string };

type TInitialState = {
  ingredients: TIngredient[];
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  order: TOrder | null;
  feed: TOrdersData | null;
  userOrders: TOrder[] | null;
  user: TUser | null;
  viewedOrder: TOrder | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TInitialState = {
  ingredients: [],
  constructorItems: {
    bun: null,
    ingredients: []
  },
  order: null,
  feed: null,
  userOrders: null,
  user: null,
  viewedOrder: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const handleAuthSuccess = (state: TInitialState, user: TUser) => {
  state.user = user;
  state.isAuthChecked = true;
  state.isLoading = false;
  state.error = null;
};

const handleAuthError = (state: TInitialState, error: string) => {
  state.isLoading = false;
  state.error = error;
  state.isAuthChecked = true;
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

//загружает список ингридиентов
export const fetchIngredients = createAsyncThunk(
  'burger/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

//Отправляет список ID ингредиентов для создания заказа
export const createOrder = createAsyncThunk(
  'burger/createOrder',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  }
);

//Получает общую ленту всех заказов
export const fetchFeed = createAsyncThunk('burger/fetchFeed', async () => {
  const data = await getFeedsApi();
  return data;
});

//Загружает историю заказов текущего пользователя
export const fetchUserOrders = createAsyncThunk(
  'burger/fetchUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

//
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

export const fetchOrderByNumber = createAsyncThunk(
  'burger/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.orders && response.orders.length > 0) {
      return response.orders[0]; // Возвращаем первый заказ из массива
    }
    throw new Error('Заказ не найден');
  }
);

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload; // Замена булки
        } else {
          state.constructorItems.ingredients.push({
            ...action.payload,
            uniqueId: uuidv4() // Добавление уникального ID
          });
        }
      },
      prepare: (ingredient: TIngredient) => ({ payload: ingredient })
    },
    //удаление ингредиента
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.uniqueId !== action.payload
        );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const ingredients = [...state.constructorItems.ingredients];
      const [movedItem] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, movedItem);
      state.constructorItems.ingredients = ingredients;
    },
    //очистка конструктора
    clearConstructor: (state) => {
      state.constructorItems = initialState.constructorItems;
    },
    //очистка заказа
    clearOrder: (state) => {
      state.order = null;
    },
    //меняет статус авторизации
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Загрузка ингридиентов
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      //создание заказа
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.order = action.payload;
          state.constructorItems = initialState.constructorItems;
        }
      )
      //загрузка ленты заказов
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      // Загрузка истории заказов пользователя
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      // Авторизация/регистрация
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      // Сброс данных пользователя
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true; // Флаг завершения проверки
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isAuthChecked = true; // Проверка завершена, даже если ошибка
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      // Обработка загрузки заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.viewedOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.viewedOrder = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
        state.viewedOrder = null;
      })
      // Общая обработка загрузки
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      // Общая обработка ошибок
      .addMatcher(isRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Произошла ошибка';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrder,
  setAuthChecked
} = burgerSlice.actions;

export default burgerSlice.reducer;

// Селекторы
export const selectIngredients = (state: RootState) =>
  state.stellarBurger.ingredients;
export const selectConstructorItems = (state: RootState) =>
  state.stellarBurger.constructorItems;
export const selectCurrentOrder = (state: RootState) =>
  state.stellarBurger.order;
export const selectFeed = (state: RootState) => state.stellarBurger.feed;
export const selectUserOrders = (state: RootState) =>
  state.stellarBurger.userOrders;
export const selectUser = (state: RootState) => state.stellarBurger.user;
export const selectAuthChecked = (state: RootState) =>
  state.stellarBurger.isAuthChecked;
export const selectBurgerLoading = (state: RootState) =>
  state.stellarBurger.isLoading;
export const selectBurgerError = (state: RootState) =>
  state.stellarBurger.error;
export const selectViewedOrder = (state: RootState) =>
  state.stellarBurger.viewedOrder;
