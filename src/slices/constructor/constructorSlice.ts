import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from 'src/services/store';

type TConstructorIngredient = TIngredient & { uniqueId: string };

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isLoading: boolean;
  error: string | null;
};

export const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  error: null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          uniqueId: uuidv4()
        }
      })
    },
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
    clearConstructor: (state) => {
      state.constructorItems = initialState.constructorItems;
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;

export default constructorSlice.reducer;
