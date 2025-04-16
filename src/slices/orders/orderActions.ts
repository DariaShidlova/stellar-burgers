import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const createOrder = createAsyncThunk(
  'burger/createOrder',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  }
);

export const fetchFeed = createAsyncThunk('burger/fetchFeed', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchUserOrders = createAsyncThunk(
  'burger/fetchUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'burger/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.orders && response.orders.length > 0) {
      return response.orders[0];
    }
    throw new Error('Заказ не найден');
  }
);
