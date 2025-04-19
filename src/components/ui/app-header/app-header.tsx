import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={`${styles.link} pt-4 pb-4 pl-5 pr-5`}
            state={{ from: location }}
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'}
            />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${
                location.pathname === '/' ? '' : 'text_color_inactive'
              }`}
            >
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={`${styles.link} pt-4 pb-4 pl-5 pr-5`}
            state={{ from: location }}
          >
            <ListIcon
              type={
                location.pathname.startsWith('/feed') ? 'primary' : 'secondary'
              }
            />
            <p
              className={`text text_type_main-default ml-2 ${
                location.pathname.startsWith('/feed')
                  ? ''
                  : 'text_color_inactive'
              }`}
            >
              Лента заказов
            </p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <Link
          to='/profile'
          className={`${styles.link} ${styles.link_position_last} pt-4 pb-4 pl-5 pr-5`}
          state={{ from: location }}
        >
          <ProfileIcon
            type={
              location.pathname.startsWith('/profile') ? 'primary' : 'secondary'
            }
          />
          {userName ? (
            <p
              className={`text text_type_main-default ml-2`}
              data-testid='user-name'
            >
              {userName}
            </p>
          ) : (
            <p
              className={`text text_type_main-default ml-2 text_color_inactive`}
            >
              Личный кабинет
            </p>
          )}
        </Link>
      </nav>
    </header>
  );
};
