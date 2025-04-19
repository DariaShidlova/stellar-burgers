/// <reference types="cypress" />

describe('Burger Constructor Tests', () => {
  context('Когда пользователь НЕ авторизован', () => {
    beforeEach(() => {
      cy.clearCookies();
      localStorage.clear();

      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      cy.intercept('GET', '**/api/auth/user', {
        statusCode: 401,
        body: { message: 'jwt malformed' }
      }).as('getUser');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.get('[data-testid="ingredient-item"]').should('exist');
    });

    it('Должен показывать конструктор без данных пользователя', () => {
      cy.get('[data-testid="user-name"]').should('not.exist');
    });

    it('Должен открывать/закрывать модальное окно ингредиента', () => {
      cy.get('#modals').should('exist');
      cy.get('#modals [data-testid="modal"]').should('not.exist');
    
      cy.get('[data-testid="ingredient-item"]').first().click({ force: true });
    
      cy.get('#modals [data-testid="modal"]', { timeout: 15000 })
        .should('exist')
        .and('be.visible');

      cy.fixture('ingredients.json').then((ingredients) => {
        const bun = ingredients.data[0];
        cy.get('#modals [data-testid="ingredient-details-name"]').should('contain', bun.name);
      });
    
      cy.get('#modals [data-testid="modal-close-button"]').click();
      cy.get('#modals [data-testid="modal"]').should('not.exist');
    
      cy.get('[data-testid="ingredient-item"]').first().click({ force: true });
      cy.get('#modals [data-testid="modal-overlay"]').click({ force: true });
      cy.get('#modals [data-testid="modal"]').should('not.exist');
    });    
  });

  context('Когда пользователь авторизован', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'mock-token');
      localStorage.setItem('refreshToken', 'mock-refresh-token');

      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
      cy.get('[data-testid="ingredient-item"]').should('exist');
    });

    it('Должен показывать имя пользователя', () => {
      cy.fixture('user.json').then((userData) => {
        cy.get('[data-testid="user-name"]').should('contain', userData.user.name);
      });
    });

    it('Должен добавить булку в конструктор и отобразить цену', () => {
      cy.get('[data-testid="ingredient-item"][data-test-type="bun"]').first().as('bunItem');
      
      cy.get('@bunItem').find('[data-testid="add-ingredient-button"] button').click({ force: true });

      cy.fixture('ingredients.json').then((ingredients) => {
        const bun = ingredients.data.find((ing) => ing.type === 'bun');
        cy.get('[data-testid="constructor-bun-top"]').should('contain', `${bun!.name} (верх)`);
        cy.get('[data-testid="total-price"]').should('contain', bun!.price * 2);
      });
    });

    it('Создание заказа и проверка модального окна', () => {
      cy.get('#modals').should('exist');
      // Добавляем булку
      cy.get('[data-testid="ingredient-item"][data-test-type="bun"]')
        .first()
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });

      // Добавляем начинку
      cy.get('[data-testid="ingredient-item"][data-test-type="main"]')
        .first()
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });

        // Кликаем кнопку заказа
        cy.get('[data-testid="constructor-order-button"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });

  // Ожидаем и проверяем успешный запрос
  cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

        // Проверяем модальное окно
        cy.get('#modals [data-testid="order-details"]', { timeout: 20000 })
        .should('be.visible')
        .within(() => {
          cy.get('[data-testid="order-identifier"]')
            .should('contain', 'идентификатор заказа');
          cy.fixture('order.json').then((order) => {
            cy.get('[data-testid="order-number"]')
              .should('contain', order.order.number);
          });
        });

      // Закрываем модалку
      cy.get('#modals [data-testid="modal-close-button"]').click();
      cy.get('#modals [data-testid="order-details"]').should('not.exist');

      // Проверяем очистку конструктора
      cy.get('[data-testid="constructor-bun-top"]').should('contain', 'Выберите булки');
      cy.get('[data-testid="constructor-ingredient"]').should('not.exist');
    });

  });
});