import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { TOrderInfo } from '../ui/order-info/type';
import { selectViewedOrder } from '../../slices/orders/orderSlice';
import { selectIngredientsData } from '../../slices/ingredients/ingredientsSlice';
import { fetchOrderByNumber } from '../../slices/orders/orderActions';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectViewedOrder);
  const ingredients = useAppSelector(selectIngredientsData);

  useEffect(() => {
    if (number) dispatch(fetchOrderByNumber(parseInt(number)));
  }, [number, dispatch]);

  const orderInfo = useMemo<TOrderInfo | null>(() => {
    if (!order || !ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc, id) => {
        const ingredient = ingredients.find((item) => item._id === id);
        if (!ingredient) return acc;

        acc[ingredient._id] = {
          ...ingredient,
          count: (acc[ingredient._id]?.count || 0) + 1
        };
        return acc;
      },
      {} as TOrderInfo['ingredientsInfo']
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date: new Date(order.createdAt),
      total
    };
  }, [order, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
