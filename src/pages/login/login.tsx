import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { loginUser, setAuthChecked } from '../../slices/auth/authSlice';
import {
  selectAuthError,
  selectAuthLoading
} from '../../slices/auth/authSlice';

import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectAuthLoading);
  const from = location.state?.from || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch(() => {
        dispatch(setAuthChecked(true));
      });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
