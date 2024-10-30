import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';
 
 
// Mock the components used in HomePage
jest.mock('../../components/Home/HomeBanner.tsx', () => ({
  HomeBanner: ({ onClick }: { onClick: () => void }) => (
    <div data-testid="HomeBanner" onClick={onClick}>HomeBanner</div>
  ),
}));
 
jest.mock('../../components/Home/HomeFeatures', () => ({
  HomeFeatures: () => <div data-testid="HomeFeatures">HomeFeatures</div>,
}));
 
jest.mock('../../components/Home/HomeQuickTip', () => ({
  HomeQuickTip: ({ onClick }: { onClick: () => void }) => (
    <div data-testid="HomeQuickTip" onClick={onClick}>HomeQuickTip</div>
  ),
}));
 
describe('HomePage', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };
 
  test('renders HomeBanner, HomeFeatures, and HomeQuickTip components', () => {
    renderComponent();
 
    expect(screen.getByTestId('HomeBanner')).toBeInTheDocument();
    expect(screen.getByTestId('HomeFeatures')).toBeInTheDocument();
    expect(screen.getByTestId('HomeQuickTip')).toBeInTheDocument();
  });
 
  test('navigates to /issuers when HomeBanner is clicked', () => {
    renderComponent();
 
    const homeBanner = screen.getByTestId('HomeBanner');
    fireEvent.click(homeBanner);
 
    expect(window.location.pathname).toBe('/issuers');
  });
 
  test('navigates to /issuers when HomeQuickTip is clicked', () => {
    renderComponent();
 
    const homeQuickTip = screen.getByTestId('HomeQuickTip');
    fireEvent.click(homeQuickTip);
 
    expect(window.location.pathname).toBe('/issuers');
  });
});