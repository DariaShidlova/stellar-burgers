import React, { FC, memo } from 'react';
import styles from './ingredient-details.module.css';
import { IngredientDetailsUIProps } from './type';

export const IngredientDetailsUI: FC<IngredientDetailsUIProps> = memo(
  ({ ingredientData }) => {
    const { name, image_large, calories, proteins, fat, carbohydrates } =
      ingredientData;

    return (
      <div className={styles.content} data-testid='ingredient-details'>
        <img
          className={styles.img}
          alt='изображение ингредиента.'
          src={image_large}
        />
        <h3
          className='text text_type_main-medium mt-2 mb-4'
          data-testid='ingredient-details-name'
        >
          {name}
        </h3>
        <ul className={`${styles.nutritional_values} text_type_main-default`}>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Калории, ккал</p>
            <p
              className={`text text_type_digits-default`}
              data-testid='ingredient-details-calories'
            >
              {calories}
            </p>
          </li>
          <li className={styles.nutritional_value}>
            <p
              className={`text mb-2 ${styles.text}`}
              data-testid='ingredient-details-proteins'
            >
              Белки, г
            </p>
            <p className={`text text_type_digits-default`}>{proteins}</p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Жиры, г</p>
            <p
              className={`text text_type_digits-default`}
              data-testid='ingredient-details-fat'
            >
              {fat}
            </p>
          </li>
          <li className={styles.nutritional_value}>
            <p className={`text mb-2 ${styles.text}`}>Углеводы, г</p>
            <p
              className={`text text_type_digits-default`}
              data-testid='ingredient-details-carbohydrates'
            >
              {carbohydrates}
            </p>
          </li>
        </ul>
      </div>
    );
  }
);
