export const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => {
  const Actual = jest.requireActual('react-router-dom');
  return {
    ...Actual,
    useNavigate: () => mockNavigateFn,
    useLocation: jest.fn().mockReturnValue({ pathname: '/' }),
    Outlet: () => <div data-testid="Outlet">Page content</div>,
  };
});

export const setMockUseLocation = (locationObj: { pathname: string }) => {
  const { useLocation } = require('react-router-dom') as { useLocation: jest.Mock };
  useLocation.mockReturnValue(locationObj);
};
