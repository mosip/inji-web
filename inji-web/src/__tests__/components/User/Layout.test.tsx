import { setMockUseLocation } from '../../../test-utils/mockRouter';
import { setMockUseSelectorState } from '../../../test-utils/mockReactRedux';
import { mockusei18n } from '../../../test-utils/mockUtils';
import { render, screen, act } from '@testing-library/react';
import { Layout } from '../../../components/User/Layout';
import * as i18n from '../../../utils/i18n';
import { showToast } from '../../../components/Common/toast/ToastWrapper';
import {RequestStatus} from "../../../utils/constants";

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

jest.mock('../../../utils/i18n', () => {
  const actual = jest.requireActual('../../../utils/i18n');
  return {
    __esModule: true,
    ...actual,
    getDirCurrentLanguage: jest.fn(),
    getCredentialTypeDisplayObjectForCurrentLanguage: jest.fn(),
    isRTL: jest.fn(),
  };
});

jest.mock('../../../components/Common/toast/ToastWrapper', () => ({
  showToast: jest.fn(),
}));

jest.mock('../../../assets/Background.svg', () => 'mock-dashboard-bg-top');
jest.mock('../../../assets/DashboardBgBottom.svg', () => 'mock-dashboard-bg-bottom');

let mockDownloadSessionDetails: any;

jest.mock('../../../hooks/User/useDownloadSession', () => ({
  useDownloadSessionDetails: () => mockDownloadSessionDetails,
}));

describe('Layout component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockusei18n();

    mockDownloadSessionDetails = {
      latestDownloadedSessionId: null,
      currentSessionDownloadId: null,
      downloadInProgressSessions: {},
      addSession: jest.fn(),
      updateSession: jest.fn(),
      removeSession: jest.fn(),
      setCurrentSessionDownloadId: jest.fn(),
      setLatestDownloadedSessionId: jest.fn(),
    };

    setMockUseSelectorState({ common: { language: 'en' } });
    setMockUseLocation({ pathname: '/' });

    (i18n.getDirCurrentLanguage as jest.Mock).mockReturnValue('ltr');
    (i18n.getCredentialTypeDisplayObjectForCurrentLanguage as jest.Mock).mockReturnValue({
      name: 'Test Credential',
      locale: 'en',
      logo: 'https://example.com/logo.png',
    });
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

  it('calls showToast with correct options when a session download is DONE', () => {
    mockDownloadSessionDetails = {
      latestDownloadedSessionId: 'session-1',
      currentSessionDownloadId: null,
      downloadInProgressSessions: {
        'session-1': {
          credentialTypeDisplayObj: [
            { name: 'Test Credential', locale: 'en', logo: 'url' },
          ],
          downloadStatus: RequestStatus.DONE,
        },
      },
      addSession: jest.fn(),
      updateSession: jest.fn(),
      removeSession: jest.fn(),
      setCurrentSessionDownloadId: jest.fn(),
      setLatestDownloadedSessionId: jest.fn(),
    };

    render(<Layout />);

    expect(i18n.getCredentialTypeDisplayObjectForCurrentLanguage).toHaveBeenCalledWith(
      mockDownloadSessionDetails.downloadInProgressSessions['session-1'].credentialTypeDisplayObj,
      'en'
    );

    expect(showToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Your Test Credential has been downloaded successfully.',
        type: 'success',
        options: expect.objectContaining({
          autoClose: 3000,
          limit: 1,
          closeButton: expect.any(Function),
          style: expect.objectContaining({
            marginTop: expect.any(Number),
          }),
        }),
      })
    );

    expect(mockDownloadSessionDetails.setLatestDownloadedSessionId).toHaveBeenCalledWith(null);
    expect(mockDownloadSessionDetails.removeSession).toHaveBeenCalledWith('session-1');
  });

  it('matches snapshot for default language', () => {
    const { container } = render(<Layout />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for rtl language', () => {
    (i18n.getDirCurrentLanguage as jest.Mock).mockReturnValue('rtl');
    const { container } = render(<Layout />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot after header and footer heights update on resize', () => {
    const { container } = render(<Layout />);

    const header = screen.getByTestId('Header');
    const footer = screen.getByTestId('Footer');

    jest.spyOn(header, 'getBoundingClientRect').mockReturnValue({
      height: 80, width: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: () => {},
    });

    jest.spyOn(footer, 'getBoundingClientRect').mockReturnValue({
      height: 60, width: 0, top: 0, left: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: () => {},
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(container.firstChild).toMatchSnapshot();
  });
});
