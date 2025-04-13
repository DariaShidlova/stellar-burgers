import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import ingredientsReducer from '../slices/ingredients/ingredientsSlice';
import constructorReducer from '../slices/constructor/constructorSlice';
import ordersReducer from '../slices/orders/orderSlice';
import authReducer from '../slices/auth/authSlice';

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    orders: ordersReducer,
    auth: authReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
