import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectFeed, fetchFeed } from '../../slices/burger-slice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const feedData = useAppSelector(selectFeed);
  const orders: TOrder[] = feedData?.orders || [];

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
