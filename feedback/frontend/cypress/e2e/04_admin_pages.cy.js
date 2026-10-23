describe('Admin Login', () => {
  beforeEach(() => cy.visit('/admin/login'));

  it('renders admin login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.contains('Access Admin Panel').should('be.visible');
  });

  it('successful admin login', () => {
    cy.get('input[type="email"]').type('admin@college.edu');
    cy.get('input[type="password"]').type('password');
    cy.get('button').contains('Access Admin Panel').click();
    cy.url({ timeout: 8000 }).should('include', '/admin/dashboard');
  });
});

describe('Admin Dashboard', () => {
  beforeEach(() => cy.loginAsAdmin());

  it('shows admin navbar links', () => {
    cy.contains('Students').should('be.visible');
    cy.contains('Faculty').should('be.visible');
    cy.contains('Courses').should('be.visible');
    cy.contains('Cycles').should('be.visible');
    cy.contains('Reports').should('be.visible');
    cy.contains('Grievances').should('be.visible');
  });
});

describe('Admin Manage Faculty', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/faculty');
  });

  it('renders faculty management page', () => {
    cy.contains('Faculty').should('be.visible');
    cy.contains('Add Faculty').should('be.visible');
  });

  it('shows faculty list', () => {
    cy.get('table', { timeout: 5000 }).should('exist');
  });
});

describe('Admin Manage Courses', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/courses');
  });

  it('renders courses page', () => {
    cy.contains('Courses').should('be.visible');
  });
});

describe('Admin Manage Cycles', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/cycles');
  });

  it('renders cycles page', () => {
    cy.contains('Feedback Cycles').should('be.visible');
    cy.contains('New Cycle').should('be.visible');
  });

  it('shows create cycle form on button click', () => {
    cy.contains('New Cycle').click();
    cy.contains('Create New Feedback Cycle').should('be.visible');
  });
});

describe('Admin Generate Report', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/reports');
  });

  it('renders report generation page', () => {
    cy.contains('Generate Reports').should('be.visible');
    cy.contains('Generate Report').should('be.visible');
  });
});

describe('Admin Grievances', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/grievances');
  });

  it('renders grievances page with stats', () => {
    cy.contains('Complaints & Grievances').should('be.visible');
    cy.contains('Total').should('be.visible');
    cy.contains('Pending').should('be.visible');
    cy.contains('Resolved').should('be.visible');
  });
});
