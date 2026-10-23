describe('Student Dashboard', () => {
  beforeEach(() => cy.loginAsStudent());

  it('shows dashboard page after login', () => {
    cy.url().should('include', '/student/dashboard');
  });

  it('shows navbar with student links', () => {
    cy.contains('Submit Feedback').should('be.visible');
    cy.contains('My History').should('be.visible');
    cy.contains('Grievance').should('be.visible');
  });

  it('Sign Out button works', () => {
    cy.contains('Sign Out').click();
    cy.url().should('include', '/login');
  });
});

describe('Submit Feedback', () => {
  beforeEach(() => {
    cy.loginAsStudent();
    cy.visit('/student/feedback');
  });

  it('renders feedback form', () => {
    cy.contains('Submit Feedback').should('be.visible');
    cy.contains('Select Course').should('be.visible');
    cy.contains('Feedback Cycle').should('be.visible');
    cy.contains('Rating').should('be.visible');
    cy.contains('Comment').should('be.visible');
  });

  it('shows error when rating not selected', () => {
    cy.get('button').contains('Submit Feedback').click();
    cy.get('.Toastify').should('exist');
  });

  it('shows submitted feedback history section', () => {
    cy.contains('My Submitted Feedback').should('be.visible');
  });
});

describe('Feedback History', () => {
  beforeEach(() => {
    cy.loginAsStudent();
    cy.visit('/student/history');
  });

  it('renders feedback history page', () => {
    cy.contains('My Feedback History').should('be.visible');
  });

  it('shows filter buttons', () => {
    cy.contains('All').should('be.visible');
    cy.contains('Positive').should('be.visible');
    cy.contains('Negative').should('be.visible');
    cy.contains('Neutral').should('be.visible');
  });

  it('filter buttons are clickable', () => {
    cy.contains('Positive').click();
    cy.contains('Positive').should('be.visible');
    cy.contains('All').click();
  });
});

describe('Student Grievance', () => {
  beforeEach(() => {
    cy.loginAsStudent();
    cy.visit('/student/grievance');
  });

  it('renders grievance form', () => {
    cy.contains('Submit Grievance').should('be.visible');
    cy.get('input[placeholder="Brief title of your grievance"]').should('be.visible');
    cy.get('textarea').should('be.visible');
  });

  it('shows error when title has numbers', () => {
    cy.get('input[placeholder="Brief title of your grievance"]').type('Test123');
    cy.contains('Title must not contain numbers').should('be.visible');
  });

  it('shows error when description has numbers', () => {
    cy.get('textarea').type('Problem 456');
    cy.contains('Description must not contain numbers').should('be.visible');
  });

  it('no error with valid text only input', () => {
    cy.get('input[placeholder="Brief title of your grievance"]').type('Valid Title');
    cy.get('textarea').type('Valid description here');
    cy.contains('Title must not contain numbers').should('not.exist');
    cy.contains('Description must not contain numbers').should('not.exist');
  });
});
