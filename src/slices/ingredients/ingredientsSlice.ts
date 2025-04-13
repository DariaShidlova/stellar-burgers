import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';
import { RootState } from 'src/services/store';
import { fetchIngredients } from './ingredientsActions';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
  viewedIngredient: TIngredient | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
  viewedIngredient: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setViewedIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.viewedIngredient = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });
  }
});

export const selectIngredientsData = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const { setViewedIngredient } = ingredientsSlice.actions;

export const selectViewedIngredient = (state: RootState) =>
  state.ingredients.viewedIngredient;

export default ingredientsSlice.reducer;
