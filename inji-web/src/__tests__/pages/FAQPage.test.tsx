import { mockNavigateFn,setMockUseLocation } from '../../test-utils/mockRouter';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQPage } from '../../pages/FAQPage';
import { navigateToUserHome } from '../../utils/navigationUtils';

jest.mock('../../utils/navigationUtils', () => ({
  navigateToUserHome: jest.fn(),
}));

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
  const { useLocation } = require('react-router-dom') as { useLocation: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigateFn.mockReset();

    setMockUseLocation({ pathname: '/' });
    useLocation.mockReturnValue({ pathname: '/', state: {} });

  });

  it('renders PageTitle and FAQAccordion', () => {
    useLocation.mockReturnValue({ pathname: '/', state: {} });

    render(<FAQPage backUrl={undefined} withHome={false} />);

    expect(screen.getByTestId('faq')).toHaveTextContent('title');
    expect(screen.getByTestId('faq-accordion')).toBeInTheDocument();
    expect(screen.queryByTestId('faq-home-button')).not.toBeInTheDocument();
  });

  it('renders home button if withHome=true and calls navigateToDashboardHome on click', () => {
    useLocation.mockReturnValue({ pathname: '/', state: {} });

    render(<FAQPage backUrl={undefined} withHome={true} />);
    const homeButton = screen.getByTestId('faq-home-button');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveTextContent('User:Home.title');

    fireEvent.click(homeButton);
    expect(navigateToUserHome).toHaveBeenCalledWith(mockNavigateFn);
  });

  it('clicking back arrow navigates to backUrl if present', () => {
    useLocation.mockReturnValue({ pathname: '/', state: {} });
  
    render(<FAQPage backUrl="/custom-back" withHome={false} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  
    fireEvent.click(svg!);
    expect(mockNavigateFn).toHaveBeenCalledWith('/custom-back');
  });

  it('clicking back arrow navigates to previousPagePath from location.state if no backUrl', () => {
    useLocation.mockReturnValue({ pathname: '/', state: { from: '/prev-page' } });

    render(<FAQPage backUrl={undefined} withHome={false} />);
    const svg = document.querySelector('svg');
    fireEvent.click(svg!);

    expect(mockNavigateFn).toHaveBeenCalledWith('/prev-page');
  });

  it('clicking back arrow calls navigateToDashboardHome if no backUrl or previousPagePath', () => {
    useLocation.mockReturnValue({ pathname: '/', state: {} });

    render(<FAQPage backUrl={undefined} withHome={false} />);
    const svg = document.querySelector('svg');
    fireEvent.click(svg!);

    expect(navigateToUserHome).toHaveBeenCalledWith(mockNavigateFn);
  });

  it('matches snapshot when withHome=false', () => {
    useLocation.mockReturnValue({ pathname: '/', state: {} });

    const { asFragment } = render(<FAQPage backUrl={undefined} withHome={false} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot when withHome=true', () => {
    useLocation.mockReturnValue({ pathname: '/', state: {} });

    const { asFragment } = render(<FAQPage backUrl={undefined} withHome={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});