import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginFailedModal } from '../../../../pages/users/login/LoginFailedModal';

// // Mocking the useTranslation hook from react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      "LoginFailedModal.failureMessage": "Login Failed!",
      "LoginFailedModal.failureDescription": "Your login request could not be completed. Please click on the retry button to login again.",
      "LoginFailedModal.retry": "Retry"
    }[key] || key),
  }),
}));

// Test suite for FailedLoginPage
describe('FailedLoginPage', () => {
  test('renders failure icon', () => {
    render(<LoginFailedModal />, { wrapper: MemoryRouter });
    const icon = screen.getByTestId('failure-icon');
    expect(icon).toBeInTheDocument();
  });

  test('renders failure message', () => {
    render(<LoginFailedModal />, { wrapper: MemoryRouter });
    const message = screen.getByTestId('failure-message');
    expect(message).toHaveTextContent('Login Failed!');
  });

  test('renders failure description', () => {
    render(<LoginFailedModal />, { wrapper: MemoryRouter });
    const description = screen.getByTestId('failure-description');
    expect(description).toHaveTextContent('Your login request could not be completed. Please click on the retry button to login again.');
  });

  test('navigates to login page on retry button click', () => {
    const { getByTestId } = render(<LoginFailedModal />, { wrapper: MemoryRouter });
    const button = getByTestId('login-failure-button');
    fireEvent.click(button);
  });
}); 