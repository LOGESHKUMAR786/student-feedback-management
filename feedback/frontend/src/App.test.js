import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// ── Mock axios ──────────────────────────────────────────────────────────────
jest.mock('./utils/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}));

import api from './utils/api';

const wrap = (ui) => render(<AuthProvider>{ui}</AuthProvider>);

// ── 1. Welcome Page ──────────────────────────────────────────────────────────
describe('Welcome Page', () => {
  test('renders StudentFeedback brand name', () => {
    render(<App />);
    expect(screen.getAllByText(/StudentFeedback/i).length).toBeGreaterThan(0);
  });

  test('renders Student, Admin, Dean portal cards', () => {
    render(<App />);
    expect(screen.getByText(/Student/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Dean/i)).toBeInTheDocument();
  });

  test('renders Get Started button', () => {
    render(<App />);
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });
});

// ── 2. Student Login Page ────────────────────────────────────────────────────
describe('Student Login Page', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider><App /></AuthProvider>
      </MemoryRouter>
    );
  });

  test('renders email and password fields', () => {
    expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
  });

  test('renders Sign In button', () => {
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('shows error on invalid credentials', async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/auth/login', expect.any(Object)));
  });

  test('successful login calls api with correct data', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'test-token', user: { id: 1, role: 'student', username: 'testuser', email: 'test@test.com' } } });
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'test@test.com', password: 'password123' }));
  });
});

// ── 3. Student Register Page ─────────────────────────────────────────────────
describe('Student Register Page', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [{ id: 1, name: 'Computer Science' }] });
    render(
      <MemoryRouter initialEntries={['/register']}>
        <AuthProvider><App /></AuthProvider>
      </MemoryRouter>
    );
  });

  test('renders registration form fields', () => {
    expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/johndoe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/john@college.edu/i)).toBeInTheDocument();
  });

  test('shows password mismatch error', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Min 6 characters/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Repeat password/i), { target: { value: 'pass456' } });
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('renders Create Account button', () => {
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('successful registration calls api', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'User registered successfully' } });
    fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/john@college.edu/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Min 6 characters/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Repeat password/i), { target: { value: 'pass123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ username: 'testuser', email: 'test@test.com' })));
  });
});

// ── 4. Admin Login Page ──────────────────────────────────────────────────────
describe('Admin Login Page', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/admin/login']}>
        <AuthProvider><App /></AuthProvider>
      </MemoryRouter>
    );
  });

  test('renders admin login form', () => {
    expect(screen.getByPlaceholderText(/admin@college.edu/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter admin password/i)).toBeInTheDocument();
  });

  test('renders Access Admin Panel button', () => {
    expect(screen.getByRole('button', { name: /Access Admin Panel/i })).toBeInTheDocument();
  });

  test('calls login api on submit', async () => {
    api.post.mockResolvedValueOnce({ data: { token: 'admin-token', user: { id: 1, role: 'admin', username: 'admin', email: 'admin@college.edu' } } });
    fireEvent.change(screen.getByPlaceholderText(/admin@college.edu/i), { target: { value: 'admin@college.edu' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter admin password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Access Admin Panel/i }));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'admin@college.edu', password: 'password' }));
  });
});

// ── 5. Dean Login Page ───────────────────────────────────────────────────────
describe('Dean Login Page', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/dean/login']}>
        <AuthProvider><App /></AuthProvider>
      </MemoryRouter>
    );
  });

  test('renders dean login form', () => {
    expect(screen.getByPlaceholderText(/dean@college.edu/i)).toBeInTheDocument();
  });

  test('renders Access Dean Portal button', () => {
    expect(screen.getByRole('button', { name: /Access Dean Portal/i })).toBeInTheDocument();
  });
});

// ── 6. Grievance Validation ──────────────────────────────────────────────────
describe('Grievance Form Validation', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'student', username: 'testuser', profileId: 1 }));
    api.get.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter initialEntries={['/student/grievance']}>
        <AuthProvider><App /></AuthProvider>
      </MemoryRouter>
    );
  });

  afterEach(() => localStorage.clear());

  test('renders grievance form', () => {
    expect(screen.getByPlaceholderText(/Brief title of your grievance/i)).toBeInTheDocument();
  });

  test('shows error when title contains numbers', () => {
    fireEvent.change(screen.getByPlaceholderText(/Brief title of your grievance/i), { target: { value: 'Test123' } });
    expect(screen.getByText(/Title must not contain numbers/i)).toBeInTheDocument();
  });

  test('shows error when description contains numbers', () => {
    fireEvent.change(screen.getByPlaceholderText(/Describe your complaint/i), { target: { value: 'Problem 123' } });
    expect(screen.getByText(/Description must not contain numbers/i)).toBeInTheDocument();
  });

  test('no error when title has only letters', () => {
    fireEvent.change(screen.getByPlaceholderText(/Brief title of your grievance/i), { target: { value: 'Valid Title' } });
    expect(screen.queryByText(/Title must not contain numbers/i)).not.toBeInTheDocument();
  });
});

// ── 7. Protected Route ───────────────────────────────────────────────────────
describe('Protected Route', () => {
  test('redirects to login when not authenticated', () => {
    localStorage.clear();
    render(
      <MemoryRouter initialEntries={['/student/dashboard']}>
        <AuthProvider><App /></AuthProvider>
      </MemoryRouter>
    );
    expect(screen.queryByText(/Student Dashboard/i)).not.toBeInTheDocument();
  });
});

// ── 8. Navbar ────────────────────────────────────────────────────────────────
describe('Navbar', () => {
  test('shows student nav links when logged in as student', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'student', username: 'testuser', profileId: 1 }));
    api.get.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter initialEntries={['/student/dashboard']}>
        <AuthProvider><App /></AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Submit Feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/Grievance/i)).toBeInTheDocument();
    localStorage.clear();
  });

  test('shows admin nav links when logged in as admin', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'admin', username: 'admin' }));
    api.get.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <AuthProvider><App /></AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Faculty/i)).toBeInTheDocument();
    expect(screen.getByText(/Reports/i)).toBeInTheDocument();
    localStorage.clear();
  });
});
