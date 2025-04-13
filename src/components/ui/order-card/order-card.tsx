import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../services/store';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-card.module.css';
import { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';
import { TIngredient } from '@utils-types';
import { selectIngredientsData } from '../../../slices/ingredients/ingredientsSlice';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState }) => {
    const ingredients = useAppSelector(selectIngredientsData);
    const enrichedOrderInfo = {
      ...orderInfo,
      ingredientsToShow: orderInfo.ingredients
        .map((id) => ingredients.find((ing) => ing._id === id))
        .filter(Boolean)
        .slice(0, maxIngredients) as TIngredient[]
    };

    const remains = Math.max(orderInfo.ingredients.length - maxIngredients, 0);
    const total = enrichedOrderInfo.ingredientsToShow.reduce(
      (acc, ing) => acc + (ing?.price || 0),
      0
    );

    return (
      <Link
        to={enrichedOrderInfo.number.toString()}
        relative='path'
        state={locationState}
        className={`p-6 mb-4 mr-2 ${styles.order}`}
      >
        <div className={styles.order_info}>
          <span className={`text text_type_digits-default ${styles.number}`}>
            #{String(enrichedOrderInfo.number).padStart(6, '0')}
          </span>
          <span className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={new Date(enrichedOrderInfo.createdAt)} />
          </span>
        </div>
        <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
          {enrichedOrderInfo.name}
        </h4>
        {locationState.background.pathname === '/profile/orders' && (
          <OrderStatus status={enrichedOrderInfo.status} />
        )}
        <div className={`pt-6 ${styles.order_content}`}>
          <ul className={styles.ingredients}>
            {enrichedOrderInfo.ingredientsToShow.map((ingredient, index) => {
              let zIndex = maxIngredients - index;
              let right = 20 * index;
              return (
                <li
                  className={styles.img_wrap}
                  style={{ zIndex: zIndex, right: right }}
                  key={index}
                >
                  <img
                    style={{
                      opacity:
                        remains && maxIngredients === index + 1 ? '0.5' : '1'
                    }}
                    className={styles.img}
                    src={ingredient.image_mobile}
                    alt={ingredient.name}
                  />
                  {maxIngredients === index + 1 ? (
                    <span
                      className={`text text_type_digits-default ${styles.remains}`}
                    >
                      {remains > 0 ? `+${remains}` : null}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div>
            <span
              className={`text text_type_digits-default pr-1 ${styles.order_total}`}
            >
              {total}
            </span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
      </Link>
    );
  }
);
