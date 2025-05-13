import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { PinPage } from '../../../pages/users/PinPage';

// Mocking the useTranslation hook from react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "set-passcode":"Set Passcode",
        "enter-passcode":"Enter Passcode",
        "confirm-passcode":"Confirm Passcode",
        "reset-passcode":"Reset Passcode",
        "set-passcode-description":"Set your passcode to get started",
        "enter-passcode-description":"Enter your 6 digit passcode",
        "passcode-warning":"Make sure you remember the password for future login",
      };
      return translations[key] || key;
    }
  })
}));

describe('PinPage', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <CookiesProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </CookiesProvider>
    );
  };

  test('renders pin page', () => {
    renderWithProviders(<PinPage />);
    const page = screen.getByTestId('pin-page');
    expect(page).toBeInTheDocument();
  });

  test('renders pin logo', () => {
    renderWithProviders(<PinPage />);
    const logo = screen.getByTestId('pin-logo');
    expect(logo).toBeInTheDocument();
  });

  test('renders pin title', () => {
    renderWithProviders(<PinPage />);
    const title = screen.getByTestId('pin-title');
    expect(title).toHaveTextContent(/Set Passcode|Enter Passcode/);
  });


  test('renders pin warning', () => {
    renderWithProviders(<PinPage />);
    const warning = screen.getByTestId('pin-warning');
    expect(warning).toHaveTextContent('Make sure you remember the password for future login');
  });

  test("renders passcode input field", () => {
    renderWithProviders(<PinPage />);
    const passcodeInput = screen.getByTestId("pin-passcode-input");
    expect(passcodeInput).toBeInTheDocument();
    expect(passcodeInput).toHaveTextContent("Enter Passcode");
  });

  test("renders confirm passcode input field when wallet does not exist", () => {
    renderWithProviders(<PinPage />);
    const confirmPasscodeInput = screen.getByTestId("pin-confirm-passcode-input");
    expect(confirmPasscodeInput).toBeInTheDocument();
    expect(confirmPasscodeInput).toHaveTextContent("Confirm Passcode");
  });


  test("renders submit button", () => {
    renderWithProviders(<PinPage />);
    const submitButton = screen.getByTestId("pin-submit-button");
    expect(submitButton).toBeInTheDocument();
  });
}); 