describe('Student Register', () => {
  beforeEach(() => cy.visit('/register'));

  it('renders registration form', () => {
    cy.get('input[placeholder="John Doe"]').should('be.visible');
    cy.get('input[placeholder="johndoe"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
  });

  it('shows password mismatch error', () => {
    cy.get('input[placeholder="Min 6 characters"]').type('pass123');
    cy.get('input[placeholder="Repeat password"]').type('pass456');
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('shows department dropdown', () => {
    cy.contains('Department').should('be.visible');
    cy.get('select').should('exist');
  });
});

describe('Student Login', () => {
  beforeEach(() => cy.visit('/login'));

  it('renders login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('Sign In').should('be.visible');
  });

  it('shows error on wrong credentials', () => {
    cy.get('input[type="email"]').type('wrong@test.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button').contains('Sign In').click();
    cy.contains('Invalid credentials', { timeout: 5000 }).should('be.visible');
  });

  it('successful student login', () => {
    cy.get('input[type="email"]').type('jana@gmail.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button').contains('Sign In').click();
    cy.url({ timeout: 8000 }).should('include', '/student/dashboard');
  });

  it('has link to register page', () => {
    cy.contains('Register here').click();
    cy.url().should('include', '/register');
  });
});
