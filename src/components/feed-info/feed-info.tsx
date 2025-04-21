import { FC } from 'react';
import { TOrder, TOrdersData } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useAppSelector } from '../../services/store';
import { selectFeed, selectUserOrders } from '../../slices/orders/orderSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feed = useAppSelector(selectFeed);
  const userOrders = useAppSelector(selectUserOrders);

  const feedData: TOrdersData = feed || {
    orders: [],
    total: 0,
    totalToday: 0
  };

  const orders = [...feedData.orders, ...(userOrders || [])];

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feedData}
    />
  );
};
