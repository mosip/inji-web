import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {Login} from "../../../components/Login/Login"

// Mock Translation
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => ({
      "Login.loginTitle": "Log In",
      "Login.loginDescription": "Log in with your account or continue as a guest to access your credentials.",
      "Login.loginNote": "Some features may be limited in guest mode.",
      "Login.loggingIn": "Logging in",
      "Login.loginGoogle": "Continue with Google",
      "Login.loginGuest": "Continue as Guest"
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
    expect(screen.getByTestId("home-banner-guest-login")).toHaveTextContent("Continue as Guest");
  });

  test("Guest login button navigates to issuers page", () => {
    render(<MemoryRouter><Login /></MemoryRouter>);
    const guestButton = screen.getByTestId("home-banner-guest-login");

    fireEvent.click(guestButton);
    expect(mockNavigate).toHaveBeenCalledWith("/issuers");
  });

  test("Google login button redirects to Google OAuth URL", () => {
    const originalHref = window.location.href;

    (window as any)._env_ = {
      MIMOTO_URL: "https://example.com",
    };

    // Mock window.location.href setter
    const setHref = jest.fn();
    Object.defineProperty(window, "location", {
      value: { set href(url: string) { setHref(url); } },
      configurable: true,
    });

    render(<MemoryRouter><Login /></MemoryRouter>);

    const googleButton = screen.getByTestId("google-login-button");
    fireEvent.click(googleButton);

    expect(setHref).toHaveBeenCalledWith("https://example.com/oauth2/authorize/google");

    Object.defineProperty(window, "location", {
      value: { href: originalHref },
      configurable: true,
    });
  });
});
