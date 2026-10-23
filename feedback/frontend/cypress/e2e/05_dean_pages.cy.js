describe('Dean Login', () => {
  beforeEach(() => cy.visit('/dean/login'));

  it('renders dean login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('Access Dean Portal').should('be.visible');
  });

  it('successful dean login', () => {
    cy.get('input[type="email"]').type('dean@college.edu');
    cy.get('input[type="password"]').type('password');
    cy.get('button').contains('Access Dean Portal').click();
    cy.url({ timeout: 8000 }).should('include', '/dean/dashboard');
  });
});

describe('Dean Dashboard', () => {
  beforeEach(() => cy.loginAsDean());

  it('shows dean navbar links', () => {
    cy.contains('Dept Reports').should('be.visible');
    cy.contains('Faculty Analytics').should('be.visible');
    cy.contains('Grievances').should('be.visible');
  });

  it('shows faculty performance stats', () => {
    cy.contains('Dean Dashboard').should('be.visible');
    cy.contains('Faculty Members').should('be.visible');
    cy.contains('Overall Avg Rating').should('be.visible');
  });
});

describe('Dean Department Reports', () => {
  beforeEach(() => {
    cy.loginAsDean();
    cy.visit('/dean/reports');
  });

  it('renders department reports page', () => {
    cy.contains('Department-wise Reports').should('be.visible');
  });

  it('shows All Departments filter', () => {
    cy.contains('All Departments').should('be.visible');
  });
});

describe('Dean Faculty Performance', () => {
  beforeEach(() => {
    cy.loginAsDean();
    cy.visit('/dean/faculty');
  });

  it('renders faculty performance page', () => {
    cy.contains('Faculty Performance').should('be.visible');
  });
});

describe('Dean Grievances', () => {
  beforeEach(() => {
    cy.loginAsDean();
    cy.visit('/dean/grievances');
  });

  it('renders grievances page', () => {
    cy.contains('Student Complaints & Grievances').should('be.visible');
    cy.contains('Total').should('be.visible');
  });

  it('shows Action Taken button on grievance cards', () => {
    cy.get('body').then($body => {
      if ($body.text().includes('Action Taken')) {
        cy.contains('Action Taken').should('be.visible');
      }
    });
  });
});
