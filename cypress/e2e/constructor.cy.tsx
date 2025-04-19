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
    });

    it('Должен показывать конструктор без данных пользователя', () => {
      cy.get('[data-testid="user-name"]').should('not.exist');
    });

    it('Должен открывать/закрывать модальное окно ингредиента', () => {
      cy.get('#modals [data-testid="modal"]').should('not.exist');
      
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .click();
      
      cy.get('#modals [data-testid="modal"]')
        .should('be.visible')
        .within(() => {
          cy.fixture('ingredients.json').then(({ data }) => {
            cy.get('[data-testid="ingredient-details-name"]').should('contain', data[0].name);
          });
        });

      cy.get('[data-testid="modal-close-button"]').click();
      cy.get('#modals [data-testid="modal"]').should('not.exist');
    });
  });

  context('Когда пользователь авторизован', () => {
    beforeEach(() => {
      cy.clearCookies();
      localStorage.clear();
      cy.setCookie('accessToken', 'mock-token');
      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
      cy.visit('/');
      cy.wait(['@getIngredients', '@getUser']);
    });

    it('Должен показывать имя пользователя', () => {
      cy.fixture('user.json').then(({ user }) => {
        cy.get('[data-testid="user-name"]').should('contain', user.name);
      });
    });

    it('Должен добавить булку в конструктор и отобразить цену', () => {
      // Добавление букли по кнопке "добавить"
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .within(() => {
          cy.get('[data-testid="add-ingredient-button"]').click();
        });

      cy.fixture('ingredients.json').then(({ data }) => {
        const bun = data.find(ing => ing.type === 'bun')!;
        const expectedPrice = bun.price * 2;
        
        cy.get('[data-testid="constructor-bun-top"]').should('contain', bun.name);
        cy.get('[data-testid="total-price"]').should('contain', expectedPrice);
      });
    });

      it('Создание заказа и проверка модального окна', () => {
      cy.get('#modals').should('exist');
      // Добавление булки
      cy.get('[data-testid="ingredient-item"][data-test-type="bun"]')
        .first()
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });

      // Добавление начинки
      cy.get('[data-testid="ingredient-item"][data-test-type="main"]')
        .first()
        .find('[data-testid="add-ingredient-button"] button')
        .click({ force: true });

      cy.get('[data-testid="constructor-ingredient"]').should('exist');

      // Клик по кнопке заказа
      cy.get('[data-testid="constructor-order-button"]')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

      // Проверка успешного запроса 
      cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

      // Проверка модального окна
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

      // Закрытие модального окна
      cy.get('#modals [data-testid="modal-close-button"]').click();
      cy.get('#modals [data-testid="order-details"]').should('not.exist');

      // Очистка конструктора
      cy.get('[data-testid="constructor-bun-top"]').should('contain', 'Выберите булки');
      cy.get('[data-testid="constructor-ingredient"]').should('not.exist');
    });       
  });
});
