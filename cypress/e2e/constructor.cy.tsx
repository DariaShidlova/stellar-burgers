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
    
      cy.get('[data-testid="ingredient-item"]').should('have.length.greaterThan', 0)
        .first()
        .click({ force: true })
    
      cy.get('#modals [data-testid="modal"]', { timeout: 15000 })
        .should('exist')
        .and('be.visible');

      cy.fixture('ingredients.json').then((ingredients) => {
        const bun = ingredients.data[0];
        cy.get('#modals [data-testid="ingredient-details-name"]')
          .should('contain', bun.name);
        cy.get('#modals [data-testid="ingredient-details-calories"]')
          .should('contain', bun.calories);
      });
    
      cy.get('#modals [data-testid="modal-close-button"]').click();
      cy.get('#modals [data-testid="modal"]').should('not.exist');
    
      cy.get('[data-testid="ingredient-item"]')
        .first()
        .click({ force: true });
    
      cy.get('#modals [data-testid="modal-overlay"]').click({ force: true });
      cy.get('#modals [data-testid="modal"]').should('not.exist');
    });    
   });
  });

  context('Когда пользователь авторизован', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'mock-token');
      localStorage.setItem('refreshToken', 'mock-refresh-token');

      cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');

      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');

      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');

      cy.get('[data-testid="ingredient-item"]').should('exist');
    });

    it('Должен показывать имя пользователя', () => {
        cy.fixture('user.json').then((userData) => {
          cy.get('[data-testid="user-name"]', { timeout: 10000 })
            .should('contain', userData.user.name);
        });
      });

    it('Должен добавить булку в конструктор и отобразить цену', () => {
      cy.get('[data-testid="constructor-bun-top"]')
        .should('contain', 'Выберите булки')
        .and('not.contain', 'Краторная булка N-200i');

      cy.get('[data-testid="constructor-bun-bottom"]')
        .should('contain', 'Выберите булки');

        cy.get('[data-testid="ingredient-item"][data-test-type="bun"]')
        .first()
        .find('[data-testid="add-ingredient-button"]')
        .find('button')
        // .click();
        .should('be.visible')
        .click({ force: true });

        cy.fixture('ingredients.json').then((ingredients) => {
          const bun = ingredients.data.find((ing) => ing.type === 'bun');
          expect(bun).to.exist;
        
          cy.get('[data-testid="constructor-bun-top"]')
            .should('contain', `${bun.name} (верх)`)
            .and('not.contain', 'Выберите булки');
        
          cy.get('[data-testid="constructor-bun-bottom"]')
            .should('contain', `${bun.name} (низ)`);
        
          cy.get('[data-testid="total-price"]')
            .should('contain', (bun.price * 2).toString());
        });        
    });
});
