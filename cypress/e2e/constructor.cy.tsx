/// <reference types="cypress" />

const SELECTORS = {
  modal: '#modals [data-testid="modal"]',
  modalCloseButton: '[data-testid="modal-close-button"]',
  ingredientItem: '[data-testid="ingredient-item"]',
  addIngredientButton: '[data-testid="add-ingredient-button"] button',
  constructorBunTop: '[data-testid="constructor-bun-top"]',
  constructorBunBottom: '[data-testid="constructor-bun-bottom"]',
  totalPrice: '[data-testid="total-price"]',
  constructorOrderButton: '[data-testid="constructor-order-button"]',
  orderNumber: '[data-testid="order-number"]',
  userName: '[data-testid="user-name"]',
};

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
      cy.get(SELECTORS.userName).should('not.exist');
    });

    it('Должен открывать/закрывать модальное окно ингредиента', () => {
      cy.get(SELECTORS.modal).should('not.exist');
      
      cy.get(SELECTORS.ingredientItem)
        .first()
        .click();
      
      cy.get(SELECTORS.modal)
        .should('be.visible')
        .within(() => {
          cy.fixture('ingredients.json').then(({ data }) => {
            cy.get('[data-testid="ingredient-details-name"]').should('contain', data[0].name);
          });
        });

      cy.get(SELECTORS.modalCloseButton).click();
      cy.get(SELECTORS.modal).should('not.exist');
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
        cy.get(SELECTORS.userName).should('contain', user.name);
      });
    });

    it('Должен добавить булку в конструктор и отобразить цену', () => {
      const bunName = 'Краторная булка N-200i';
      const bunPrice = 1255;
    
      // 1. Проверяем, что булка отсутствует в конструкторе
      cy.get(SELECTORS.constructorBunTop).should('contain', 'Выберите булки');
      cy.get(SELECTORS.constructorBunBottom).should('contain', 'Выберите булки');
    
      // 2. Находим нужную булку и нажимаем "Добавить"
      cy.get(SELECTORS.ingredientItem)
        .contains(bunName)
        .parents(SELECTORS.ingredientItem)
        .within(() => {
          cy.get(SELECTORS.addIngredientButton).click();
        });
    
      // 3. Проверяем, что эта булка появилась сверху и снизу
      cy.get(SELECTORS.constructorBunTop).should('contain', `${bunName} (верх)`);
      cy.get(SELECTORS.constructorBunBottom).should('contain', `${bunName} (низ)`);
    
      // 4. Проверяем правильную цену (булка × 2)
      cy.get(SELECTORS.totalPrice).should('contain', `${bunPrice * 2}`);
    });
    
    it('Должен создать заказ и очистить конструктор', () => {
      const bunName = 'Краторная булка N-200i';
      const mainName = 'Биокотлета из марсианской Магнолии';
      const sauceName = 'Соус Spicy-X';
    
      // Добавляем булку
      cy.get(SELECTORS.ingredientItem)
        .contains(bunName)
        .parents(SELECTORS.ingredientItem)
        .within(() => {
          cy.get(SELECTORS.addIngredientButton).click();
        });
    
      // Добавляем начинку
      cy.get(SELECTORS.ingredientItem)
        .contains(mainName)
        .parents(SELECTORS.ingredientItem)
        .within(() => {
          cy.get(SELECTORS.addIngredientButton).click();
        });
    
      // Добавляем соус
      cy.get(SELECTORS.ingredientItem)
        .contains(sauceName)
        .parents(SELECTORS.ingredientItem)
        .within(() => {
          cy.get(SELECTORS.addIngredientButton).click();
        });
    
      // Оформляем заказ
      cy.get(SELECTORS.constructorOrderButton).click();
      cy.wait('@createOrder');
    
      // Проверяем модальное окно и номер заказа
      cy.get(SELECTORS.modal).should('be.visible');
      cy.fixture('order.json').then((orderData) => {
        cy.get(SELECTORS.orderNumber).should('contain', orderData.order.number);
      });
    
      // Закрываем модалку
      cy.get(SELECTORS.modalCloseButton).click();
      cy.get(SELECTORS.modal).should('not.exist');
    
      // Проверяем, что конструктор пуст
      cy.get(SELECTORS.constructorBunTop).should('contain', 'Выберите булки');
      cy.get(SELECTORS.constructorBunBottom).should('contain', 'Выберите булки');
      cy.get('[data-testid="constructor-fillings"]').should('not.exist');
    });
  });
});

