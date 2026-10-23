// Custom commands
Cypress.Commands.add('loginAsStudent', () => {
  cy.visit('/login');
  cy.get('input[type="email"]').type('jana@gmail.com');
  cy.get('input[type="password"]').type('password');
  cy.get('button').contains('Sign In').click();
  cy.url().should('include', '/student/dashboard');
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/admin/login');
  cy.get('input[type="email"]').type('admin@college.edu');
  cy.get('input[type="password"]').type('password');
  cy.get('button').contains('Access Admin Panel').click();
  cy.url().should('include', '/admin/dashboard');
});

Cypress.Commands.add('loginAsDean', () => {
  cy.visit('/dean/login');
  cy.get('input[type="email"]').type('dean@college.edu');
  cy.get('input[type="password"]').type('password');
  cy.get('button').contains('Access Dean Portal').click();
  cy.url().should('include', '/dean/dashboard');
});
