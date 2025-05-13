import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Login } from "../../../pages/users/login/Login";
import { useTranslation } from "react-i18next";

// Mock Translation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      "Login.login-title": "Log In",
      "Login.login-description": "Log in with your account or continue as a guest to access your credentials.",
      "Login.login-note": "Some features may be limited in guest mode.",
      "Login.logging-in": "Logging in",
      "Login.login-google": "Continue with Google",
      "Login.login-guest": "Continue as Guest"
    }[key] || key),
  }),
}));

// Mock useNavigate for navigation testing
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Page Tests", () => {
  test("renders all elements on the login page", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);

    expect(screen.getByTestId("login-logo")).toBeInTheDocument();
    expect(screen.getByTestId("login-title")).toHaveTextContent("Log In");
    expect(screen.getByTestId("login-description")).toHaveTextContent(
      "Log in with your account or continue as a guest to access your credentials."
    );
    expect(screen.getByTestId("login-note")).toHaveTextContent("Some features may be limited in guest mode.");
    expect(screen.getByTestId("google-login-button")).toHaveTextContent("Continue with Google");
    expect(screen.getByTestId("HomeBanner-Guest-Login")).toHaveTextContent("Continue as Guest");
  });

  test("Guest login button navigates to issuers page", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const guestButton = screen.getByTestId("HomeBanner-Guest-Login");
    
    fireEvent.click(guestButton);
    expect(mockNavigate).toHaveBeenCalledWith("/issuers");
  });
});
