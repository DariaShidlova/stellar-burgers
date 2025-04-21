import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError
} from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../../utils/types';
import {
  orderBurgerApi,
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { RootState } from 'src/services/store';
import { isRejected, isPending } from '@reduxjs/toolkit';
import {
  createOrder,
  fetchFeed,
  fetchOrderByNumber,
  fetchUserOrders
} from './orderActions';

type TOrdersState = {
  order: TOrder | null;
  feed: TOrdersData | null;
  userOrders: TOrder[] | null;
  viewedOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TOrdersState = {
  order: null,
  feed: null,
  userOrders: null,
  viewedOrder: null,
  isLoading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.order = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      //загрузка ленты заказов
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      })
      // Загрузка истории заказов пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
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
      .addMatcher(
        (action) => action.type.startsWith('burger/') && isPending(action),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (
          action
        ): action is PayloadAction<unknown, string, any, SerializedError> =>
          action.type.startsWith('burger/') && isRejected(action),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message || 'Ошибка заказа';
        }
      );
  }
});

export const { clearOrder } = ordersSlice.actions;
export const selectCurrentOrder = (state: RootState) => state.orders.order;
export const selectFeed = (state: RootState) => state.orders.feed;
export const selectUserOrders = (state: RootState) => state.orders.userOrders;
export const selectViewedOrder = (state: RootState) => state.orders.viewedOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export default ordersSlice.reducer;
