import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  selectOrdersLoading,
  selectUserOrders
} from '../../slices/orders/orderSlice';
import { fetchUserOrders } from '../../slices/orders/orderActions';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders) || [];
  const isLoading = useAppSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
