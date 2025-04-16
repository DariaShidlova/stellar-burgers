import ingredientsReducer, { initialState } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';
import { fetchIngredients } from './ingredientsActions';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.jpg',
    image_mobile: 'image-mobile.jpg',
    image_large: 'image-large.jpg'
  }
];

describe('ingredientsSlice reducer', () => {
  it('should handle initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
  });

  it('should handle fetchIngredients.rejected', () => {
    const errorMessage = 'Network Error';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.error).toBe(errorMessage);
    expect(state.isLoading).toBe(false);
  });
});
