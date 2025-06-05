import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { PasscodePage } from '../../../pages/User/PasscodePage';
import { UserProvider } from '../../../hooks/useUser';

// Mocking the useTranslation hook from react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "setPasscode":"Set Passcode",
        "enterPasscode":"Enter Passcode",
        "confirmPasscode":"Confirm Passcode",
        "resetasscode":"Reset Passcode",
        "setPasscodeDescription":"Set your passcode to get started",
        "enterPasscodeDescription":"Enter your 6 digit passcode",
        "passcodeWarning":"Make sure you remember the password for future login",
      };
      return translations[key] || key;
    }
  })
}));

describe('Passcode', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <CookiesProvider>
            <UserProvider>
                <MemoryRouter>{ui}</MemoryRouter>
            </UserProvider>
        </CookiesProvider>
    );
  };

  test('renders passcode page', () => {
    renderWithProviders(<PasscodePage />);
    const page = screen.getByTestId('passcode-page');
    expect(page).toBeInTheDocument();
  });

  test('renders passcode logo', () => {
    renderWithProviders(<PasscodePage />);
    const logo = screen.getByTestId('logo-inji-web-container');
    expect(logo).toBeInTheDocument();
  });

  test('renders passcode title', () => {
    renderWithProviders(<PasscodePage />);
    const title = screen.getByTestId('title-passcode');
    expect(title).toHaveTextContent(/Set Passcode|Enter Passcode/);
  });


  test('renders passcode warning', () => {
    renderWithProviders(<PasscodePage />);
    const warning = screen.getByTestId('passcode-warning');
    expect(warning).toHaveTextContent('Make sure you remember the password for future login');
  });

  test("renders passcode input field", () => {
    renderWithProviders(<PasscodePage />);
    const passcodeInput = screen.getByTestId("input-passcode");
    expect(passcodeInput).toBeInTheDocument();
    expect(passcodeInput).toHaveTextContent("Enter Passcode");
  });

  test("renders confirm passcode input field when wallet does not exist", () => {
    renderWithProviders(<PasscodePage />);
    const confirmPasscodeInput = screen.getByTestId("input-confirm-passcode");
    expect(confirmPasscodeInput).toBeInTheDocument();
    expect(confirmPasscodeInput).toHaveTextContent("Confirm Passcode");
  });


  test("renders submit button", () => {
    renderWithProviders(<PasscodePage />);
    const submitButton = screen.getByTestId("btn-submit-passcode");
    expect(submitButton).toBeInTheDocument();
  });
}); 