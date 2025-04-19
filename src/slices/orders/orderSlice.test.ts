import ordersReducer, { initialState } from './orderSlice';
import { TOrder, TOrdersData } from '../../utils/types';
import {
  createOrder,
  fetchFeed,
  fetchOrderByNumber,
  fetchUserOrders
} from './orderActions';

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['60d3b41abdacab0026a733c6'],
  status: 'done',
  name: 'Space флюоресцентный бургер',
  createdAt: '2023-10-20T12:00:00.000Z',
  updatedAt: '2023-10-20T12:30:00.000Z',
  number: 12345
};

const mockFeed: TOrdersData = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('ordersSlice reducer', () => {
  it('should return initial state', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('createOrder action', () => {
    it('should handle pending', () => {
      const action = { type: createOrder.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('should handle fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        order: mockOrder,
        isLoading: false
      });
    });

    it('should handle rejected', () => {
      const errorMessage = 'Failed to create order';
      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('fetchFeed action', () => {
    it('should handle pending', () => {
      const action = { type: fetchFeed.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('should handle fulfilled', () => {
      const action = {
        type: fetchFeed.fulfilled.type,
        payload: mockFeed
      };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        feed: mockFeed,
        isLoading: false
      });
    });

    it('should handle rejected', () => {
      const errorMessage = 'Failed to fetch feed';
      const action = {
        type: fetchFeed.rejected.type,
        error: { message: errorMessage }
      };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('fetchUserOrders action', () => {
    it('should handle pending', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null
      });
    });

    it('should handle fulfilled', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: [mockOrder]
      };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        userOrders: [mockOrder],
        isLoading: false
      });
    });

    it('should handle rejected', () => {
      const errorMessage = 'Failed to fetch user orders';
      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: errorMessage }
      };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage
      });
    });
  });

  describe('fetchOrderByNumber action', () => {
    it('should handle pending', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null,
        viewedOrder: null
      });
    });

    it('should handle fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        viewedOrder: mockOrder,
        isLoading: false
      });
    });

    it('should handle rejected', () => {
      const errorMessage = 'Order not found';
      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: errorMessage }
      };
      const state = ordersReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage,
        viewedOrder: null
      });
    });
  });

  it('should handle clearOrder action', () => {
    const stateWithOrder = ordersReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    });
    const action = { type: 'orders/clearOrder' };
    const state = ordersReducer(stateWithOrder, action);

    expect(state.order).toBeNull();
  });

  it('should handle all pending matcher', () => {
    const action = createOrder.pending('test-request-id', []);
    const state = ordersReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle all rejected matcher', () => {
    const errorMessage = 'Generic error';
    const error = new Error(errorMessage);
    const action = createOrder.rejected(error, 'test-request-id', []);
    const state = ordersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
