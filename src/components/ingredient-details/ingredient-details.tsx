import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store';
import {
  selectIngredientsData,
  selectIngredientsLoading
} from '../../slices/ingredients/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectIngredientsData);
  const isLoading = useAppSelector(selectIngredientsLoading);

  const ingredientData = ingredients.find((ing) => ing._id === id);

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
