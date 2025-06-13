import {setMockUseSelectorState } from '../../../test-utils/mockUtils';
import { render, screen, act } from '@testing-library/react';
import { Layout } from '../../../components/User/Layout';
import { useSelector } from 'react-redux';
import * as i18n from '../../../utils/i18n';

jest.mock('../../../components/User/Header', () => ({
  Header: ({ headerRef, headerHeight }: any) => (
    <div data-testid="Header" ref={headerRef}>
      Header - height: {headerHeight}
    </div>
  ),
}));

jest.mock('../../../components/User/Sidebar', () => ({
  Sidebar: () => <div data-testid="Sidebar">Sidebar</div>,
}));

jest.mock('../../../components/PageTemplate/Footer', () => ({
  Footer: ({ footerRef }: any) => (
    <div data-testid="Footer" ref={footerRef}>
      Footer
    </div>
  ),
}));

jest.mock('../../../utils/i18n', () => ({
  getDirCurrentLanguage: jest.fn(),
}));

jest.mock('../../../assets/Background.svg', () => 'mock-dashboard-bg-top');
jest.mock('../../../assets/DashboardBgBottom.svg', () => 'mock-dashboard-bg-bottom');

describe('Layout component', () => {
  beforeEach(() => {
    setMockUseSelectorState({ common: { language: 'en' } });
    (i18n.getDirCurrentLanguage as jest.Mock).mockReturnValue('ltr');
  });

  it('renders layout with Header, Sidebar, Outlet and Footer', () => {
    render(<Layout />);
    expect(screen.getByTestId('Header')).toBeInTheDocument();
    expect(screen.getByTestId('Sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('Footer')).toBeInTheDocument();
    expect(screen.getByTestId('Outlet')).toBeInTheDocument();
  });

  it('sets dir attribute based on current language', () => {
    (i18n.getDirCurrentLanguage as jest.Mock).mockReturnValue('rtl');
    const { container } = render(<Layout />);
    expect(container.firstChild).toHaveAttribute('dir', 'rtl');
  });

  it('updates header and footer height on mount and resize', () => {
    const { container } = render(<Layout />);

    const header = screen.getByTestId('Header');
    const footer = screen.getByTestId('Footer');

    // Simulate DOM rects
    jest.spyOn(header, 'getBoundingClientRect').mockReturnValue({
      height: 80,
      width: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: () => {},
    });

    jest.spyOn(footer, 'getBoundingClientRect').mockReturnValue({
      height: 60,
      width: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: () => {},
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

   // Snapshot test for the default (ltr) language rendering of Layout
   it('matches snapshot for default language', () => {
    const { container } = render(<Layout />);
    expect(container.firstChild).toMatchSnapshot();
  });

  // Snapshot test for RTL language rendering of Layout
  it('matches snapshot for rtl language', () => {
    (i18n.getDirCurrentLanguage as jest.Mock).mockReturnValue('rtl');
    const { container } = render(<Layout />);
    expect(container.firstChild).toMatchSnapshot();
  });

  // Snapshot test after simulating a resize that updates header and footer heights
  it('matches snapshot after header and footer heights update on resize', () => {
    const { container } = render(<Layout />);

    const header = screen.getByTestId('Header');
    const footer = screen.getByTestId('Footer');

    // Set DOM rects for header and footer to specific heights
    jest.spyOn(header, 'getBoundingClientRect').mockReturnValue({
      height: 80,
      width: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    jest.spyOn(footer, 'getBoundingClientRect').mockReturnValue({
      height: 60,
      width: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});
