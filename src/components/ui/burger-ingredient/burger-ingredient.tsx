import React, { FC, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import styles from './burger-ingredient.module.css';
import {
  Counter,
  CurrencyIcon,
  AddButton
} from '@zlden/react-developer-burger-ui-components';
import { TBurgerIngredientUIProps } from './type';
import {
  addIngredient,
  selectConstructorItems
} from '../../../slices/constructor/constructorSlice';

export const BurgerIngredientUI: FC<TBurgerIngredientUIProps> = memo(
  ({ ingredient, locationState }) => {
    const dispatch = useAppDispatch();
    const constructorItems = useAppSelector(selectConstructorItems);
    const { image, price, name, _id, type } = ingredient;

    const count = useMemo(() => {
      if (type === 'bun') {
        return constructorItems.bun?._id === _id ? 2 : 0;
      }
      return constructorItems.ingredients.filter((item) => item._id === _id)
        .length;
    }, [constructorItems, _id, type]);

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    return (
      <li
        className={styles.container}
        data-testid='ingredient-item'
        //data-testid={`ingredient-item-${ingredient._id}`}
        data-test-type={ingredient.type}
      >
        <Link
          className={styles.article}
          to={`/ingredients/${_id}`}
          state={locationState}
        >
          {count > 0 && <Counter count={count} />}
          <img className={styles.img} src={image} alt={`Ингредиент ${name}`} />
          <div className={`${styles.cost} mt-2 mb-2`}>
            <p className='text text_type_digits-default mr-2'>{price}</p>
            <CurrencyIcon type='primary' />
          </div>
          <p className={`text text_type_main-default ${styles.text}`}>{name}</p>
        </Link>
        <span data-testid='add-ingredient-button'>
          <AddButton
            text='Добавить'
            onClick={handleAdd}
            extraClass={`${styles.addButton} mt-8`}
          />
        </span>
      </li>
    );
  }
);
