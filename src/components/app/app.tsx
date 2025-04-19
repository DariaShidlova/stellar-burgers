import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import {
  ConstructorPage,
  Feed,
  NotFound404,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { ProtectedRoute } from '../protected-route/protected-route';
import {
  fetchUser,
  selectAuthChecked,
  selectUser,
  setAuthChecked
} from '../../slices/auth/authSlice';
import { fetchIngredients } from '../../slices/ingredients/ingredientsActions';
import { fetchFeed } from '../../slices/orders/orderActions';

export const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;

  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectAuthChecked);
  const token = getCookie('accessToken');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          await dispatch(fetchUser()).unwrap();
        }
      } catch (error) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    dispatch(fetchIngredients());
    dispatch(fetchFeed());
    checkAuth();
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(backgroundLocation?.pathname || '/');
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path='/login'
          element={
            <ProtectedRoute unAuthOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute unAuthOnly>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='История заказа' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
