import { render, screen, fireEvent } from '@testing-library/react';
import { FAQPage } from '../../pages/FAQPage';
import { useLocation } from 'react-router-dom';
import { navigateToUserHome } from '../../utils/navigationUtils';
// Mocks
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}));

jest.mock('../../utils/navigationUtils', () => ({
  navigateToUserHome: jest.fn(),
}));
// is it correct?
jest.mock('../../components/Common/PageTitle/PageTitle', () => ({
  PageTitle: ({ value, testId }: { value: string; testId?: string }) => (
    <h1 data-testid={testId}>{value}</h1>
  ),
}));

jest.mock('../../components/Common/Buttons/TertiaryButton', () => ({
  TertiaryButton: ({ testId, onClick, title }: any) => (
    <button data-testid={testId} onClick={onClick}>{title}</button>
  ),
}));

jest.mock('../../components/Faq/FAQAccordion', () => ({
  FAQAccordion: () => <div data-testid="faq-accordion" />,
}));

describe('FAQPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders PageTitle and FAQAccordion', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: {} });

    render(<FAQPage backUrl={undefined} withHome={false} />);

    expect(screen.getByTestId('faq')).toHaveTextContent('title');
    expect(screen.getByTestId('faq-accordion')).toBeInTheDocument();
    expect(screen.queryByTestId('faq-home-button')).not.toBeInTheDocument();
  });

  it('renders home button if withHome=true and calls navigateToDashboardHome on click', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: {} });

    render(<FAQPage backUrl={undefined} withHome={true} />);
    const homeButton = screen.getByTestId('faq-home-button');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveTextContent('User:Home.title');

    fireEvent.click(homeButton);
    expect(navigateToUserHome).toHaveBeenCalledWith(mockNavigate);
  });

  it('clicking back arrow navigates to backUrl if present', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: {} });
  
    render(<FAQPage backUrl="/custom-back" withHome={false} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  
    fireEvent.click(svg!);
    expect(mockNavigate).toHaveBeenCalledWith('/custom-back');
  });

  it('clicking back arrow navigates to previousPagePath from location.state if no backUrl', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: { from: '/prev-page' } });

    render(<FAQPage backUrl={undefined} withHome={false} />);
    const svg = document.querySelector('svg');
    fireEvent.click(svg!);

    expect(mockNavigate).toHaveBeenCalledWith('/prev-page');
  });

  it('clicking back arrow calls navigateToDashboardHome if no backUrl or previousPagePath', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: {} });

    render(<FAQPage backUrl={undefined} withHome={false} />);
    const svg = document.querySelector('svg');
    fireEvent.click(svg!);

    expect(navigateToUserHome).toHaveBeenCalledWith(mockNavigate);
  });

  it('matches snapshot when withHome=false', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: {} });

    const { asFragment } = render(<FAQPage backUrl={undefined} withHome={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when withHome=true', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: {} });

    const { asFragment } = render(<FAQPage backUrl={undefined} withHome={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});