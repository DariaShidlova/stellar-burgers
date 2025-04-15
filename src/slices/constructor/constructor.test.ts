import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  initialState
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 100,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg'
};

const mockFilling: TIngredient = {
  _id: '2',
  name: 'Начинка',
  type: 'main',
  proteins: 50,
  fat: 30,
  carbohydrates: 40,
  calories: 300,
  price: 50,
  image: 'filling.jpg',
  image_mobile: 'filling-mobile.jpg',
  image_large: 'filling-large.jpg'
};

describe('constructorSlice reducer', () => {
  it('should handle initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should add bun ingredient', () => {
    const action = addIngredient(mockBun);
    const state = constructorReducer(initialState, action);
    expect(state.constructorItems.bun).toMatchObject(mockBun);
  });

  it('should add filling ingredient', () => {
    const action = addIngredient(mockFilling);
    const state = constructorReducer(initialState, action);
    expect(state.constructorItems.ingredients).toHaveLength(1);
  });

  it('should remove ingredient', () => {
    const stateWithIngredient = constructorReducer(
      initialState,
      addIngredient(mockFilling)
    );
    const action = removeIngredient(
      stateWithIngredient.constructorItems.ingredients[0].uniqueId
    );
    const newState = constructorReducer(stateWithIngredient, action);
    expect(newState.constructorItems.ingredients).toHaveLength(0);
  });

  it('should move ingredients', () => {
    const ingredients = [
      { ...mockFilling, uniqueId: '1' },
      { ...mockFilling, uniqueId: '2' }
    ];
    const state = {
      ...initialState,
      constructorItems: { ...initialState.constructorItems, ingredients }
    };
    const action = moveIngredient({ from: 0, to: 1 });
    const newState = constructorReducer(state, action);
    expect(
      newState.constructorItems.ingredients.map((i) => i.uniqueId)
    ).toEqual(['2', '1']);
  });
});
