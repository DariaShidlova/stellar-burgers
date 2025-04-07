import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectBurgerLoading,
  selectCurrentOrder,
  selectUser,
  createOrder,
  clearConstructor,
  clearOrder
} from '../../slices/burger-slice';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAppSelector(selectUser);
  const orderRequest = useAppSelector(selectBurgerLoading);
  const constructorItems = useAppSelector(selectConstructorItems);
  const orderModalData = useAppSelector(selectCurrentOrder);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    if (constructorItems.bun && constructorItems.ingredients.length) {
      const ingredientsIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];

      dispatch(createOrder(ingredientsIds));
    }
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((sum, item) => sum + item.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
