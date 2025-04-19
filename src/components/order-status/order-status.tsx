import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusTextMap: Record<string, string> = {
  done: 'Выполнен',
  pending: 'Готовится',
  created: 'Создан',
  cancelled: 'Отменён'
};

const textColorMap: Record<string, string> = {
  done: '#00CCCC',
  pending: '#E52B1A',
  created: '#F2F2F3',
  cancelled: '#E52B1A'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const text = statusTextMap[status] || status;
  const color = textColorMap[status] || '#F2F2F3';

  return <OrderStatusUI textStyle={color} text={text} />;
};
