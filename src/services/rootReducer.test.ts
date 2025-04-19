import { rootReducer } from './store';
import { initialState as constructorInitialState } from '../slices/constructor/constructorSlice';
import { initialState as ingredientsInitialState } from '../slices/ingredients/ingredientsSlice';
import { initialState as ordersInitialState } from '../slices/orders/orderSlice';
import { initialState as authInitialState } from '../slices/auth/authSlice';

describe('rootReducer initialization', () => {
  it('should combine all reducers correctly', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      orders: ordersInitialState,
      auth: authInitialState
    });
  });
});
