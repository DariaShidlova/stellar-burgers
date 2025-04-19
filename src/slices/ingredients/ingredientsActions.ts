import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';

export const fetchIngredients = createAsyncThunk(
  'burger/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);
