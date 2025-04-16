import { beforeEach, describe, it } from 'node:test';

/// <reference types="cypress" />

describe('Burger Constructor Tests', () => {
  beforeEach(() => {
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.intercept('GET', 'api/redients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  it('should add ingredients to constructor', () => {
    // Добавление и проверка булки
    cy.get('[data-testid="ingredient-bun"]').first().click();
    cy.get('[data-testid="constructor-bun-top"]').should(
      'contain',
      'Краторная булка N-200i (верх)'
    );
    cy.get('[data-testid="constructor-bun-bottom"]').should(
      'contain',
      'Краторная булка N-200i (низ)'
    );

    // Попытка добавить вторую булку
    cy.get('[data-testid="ingredient-bun"]').eq(1).click();
    cy.get('[data-testid="constructor-bun-top"]').should(
      'not.contain',
      'Флюоресцентная булка R2-D3'
    );

    // Добавление и проверка начинки
    cy.get('[data-testid="ingredient-main"]').first().click();
    cy.get('[data-testid="constructor-ingredient"]')
      .should('have.length', 1)
      .and('contain', 'Биокотлета из марсианской Магнолии');
  });

  it('should handle ingredient modal', () => {
    // Проверка открытия и содержимого модалки
    cy.get('[data-testid="ingredient-item"]').first().click();
    cy.get('[data-testid="ingredient-modal"]').within(() => {
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Калории').should('be.visible');
      cy.contains('420').should('be.visible');
    });

    // Закрытие модалки
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="ingredient-modal"]').should('not.exist');

    // Закрытие через оверлей
    cy.get('[data-testid="ingredient-item"]').first().click();
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="ingredient-modal"]').should('not.exist');
  });

  it('should create order successfully', () => {
    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      fixture: 'order.json'
    }).as('createOrder');

    // Сборка бургера
    cy.get('[data-testid="ingredient-bun"]').first().click();
    cy.get('[data-testid="ingredient-main"]').first().click();

    // Оформление заказа
    cy.get('[data-testid="order-button"]').click();

    // Проверка запроса
    cy.wait('@createOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: [
          '643d69a5c3f7b9001cfa093c', // ID булки
          '643d69a5c3f7b9001cfa0941' // ID начинки
        ]
      });

    // Проверка модалки заказа
    cy.get('[data-testid="order-modal"]').within(() => {
      cy.contains('идентификатор заказа').should('be.visible');
      cy.get('[data-testid="order-number"]').should('contain', '12345');
    });

    // Закрытие модалки и проверка очистки
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
    cy.get('[data-testid="constructor-ingredient"]').should('not.exist');
  });

  it('should handle order creation error', () => {
    cy.intercept('POST', 'api/orders', {
      statusCode: 500,
      body: { message: 'Ошибка сервера' }
    }).as('createOrder');

    cy.get('[data-testid="ingredient-bun"]').first().click();
    cy.get('[data-testid="order-button"]').click();

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Ошибка при создании заказа');
  });

  it('should redirect unauthorized users to login', () => {
    cy.clearCookies();
    localStorage.removeItem('refreshToken');
    cy.intercept('GET', 'api/auth/user', { statusCode: 401 });

    cy.get('[data-testid="order-button"]').click();
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-header"]').should('be.visible');
  });
});
