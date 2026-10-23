describe('Welcome Page', () => {
  beforeEach(() => cy.visit('/'));

  it('shows StudentFeedback brand', () => {
    cy.contains('StudentFeedback').should('be.visible');
  });

  it('shows 3 portal cards - Student, Admin, Dean', () => {
    cy.contains('Student').should('be.visible');
    cy.contains('Admin').should('be.visible');
    cy.contains('Dean').should('be.visible');
  });

  it('Get Started button navigates to login', () => {
    cy.contains('Get Started').click();
    cy.url().should('include', '/login');
  });

  it('Student Login button navigates to login page', () => {
    cy.get('button').contains('Login').first().click();
    cy.url().should('include', '/login');
  });
});
