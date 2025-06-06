import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar,SidebarItem } from '../../../components/User/Sidebar';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  Outlet: () => <div data-testid="Outlet">Page content</div>,
}));


describe('Sidebar', () => {
  const useSelectorMock = require('react-redux').useSelector as jest.Mock;
  const useNavigateMock = require('react-router-dom').useNavigate as jest.Mock;
  const useLocationMock = require('react-router-dom').useLocation as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    useSelectorMock.mockImplementation((selector: any) =>
      selector({ common: { language: 'en' } })
    );

    // Default location.pathname = "/user/home"
    useLocationMock.mockReturnValue({ pathname: '/user/home' });

    useNavigateMock.mockReturnValue(jest.fn());
  });

  it('renders sidebar items with correct text', () => {
    render(<Sidebar />);
    expect(screen.getByText('Home.title')).toBeInTheDocument();
    expect(screen.getByText('StoredCards:title')).toBeInTheDocument();
  });

  it('sets active class on current location path', () => {
    render(<Sidebar />);
    const activeItem = screen.getByText('Home.title');
    expect(activeItem).toHaveClass('text-[#2B011C]');
  });

  it('toggles collapse state when CollapseButton is clicked', () => {
    render(<Sidebar />);
    
    const collapseBtn = screen.getByRole('button');
    const sidebarContainer = screen.getByTestId('sidebar-container');   

    expect(sidebarContainer).toHaveClass('w-64');
    fireEvent.click(collapseBtn);
    expect(sidebarContainer).toHaveClass('w-5');
  });

  it('navigates on SidebarItem click', () => {
    const navigateFn = jest.fn();
    useNavigateMock.mockReturnValue(navigateFn);

    render(<Sidebar />);
    fireEvent.click(screen.getByText('Home.title'));

    expect(navigateFn).toHaveBeenCalledWith('/user/home');
  });

  it('renders RTL classes when language is "ar"', () => {
    // Change language to Arabic (RTL)
    useSelectorMock.mockImplementation((selector: any) =>
      selector({ common: { language: 'ar' } })
    );

    render(<Sidebar />);
    const sidebarContainer = screen.getByTestId('sidebar-container');
    expect(sidebarContainer).toHaveClass('right-0');
  });
});

describe('SidebarItem', () => {
  const useSelectorMock = require('react-redux').useSelector as jest.Mock;
  const useNavigateMock = require('react-router-dom').useNavigate as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  
    useSelectorMock.mockImplementation((selector: any) =>
      selector({ common: { language: 'en' } })
    );

    useNavigateMock.mockReturnValue(jest.fn());
  });

  it('renders icon and text correctly', () => {
    const icon = <svg data-testid="icon" />;
    render(
      <SidebarItem
        icon={icon}
        text="Test Item"
        path="/test"
        isActive={false}
        isCollapsed={false}
      />
    );
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls navigate with path on click', () => {
    const navigateFn = jest.fn();
    useNavigateMock.mockReturnValue(navigateFn);

    const icon = <svg />;
    render(
      <SidebarItem
        icon={icon}
        text="Click me"
        path="/clicked"
        isActive={false}
        isCollapsed={false}
      />
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(navigateFn).toHaveBeenCalledWith('/clicked');
  });

  it('shows active indicator when isActive is true', () => {
    const icon = <svg />;
    render(
      <SidebarItem
        icon={icon}
        text="Active Item"
        path="/active"
        isActive={true}
        isCollapsed={false}
      />
    );
    const indicator = screen.getByTestId('active-indicator');
    expect(indicator).toHaveClass('bg-[#2B011C]');
  });

  it('hides text when isCollapsed is true', () => {
    const icon = <svg />;
    render(
      <SidebarItem
        icon={icon}
        text="Hidden Text"
        path="/hidden"
        isActive={false}
        isCollapsed={true}
      />
    );
    expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument();
  });
});
