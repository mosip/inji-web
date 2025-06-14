jest.mock('react-redux', () => {
    const ActualReactRedux = jest.requireActual('react-redux');
    return {
      ...ActualReactRedux,
      useSelector: jest.fn(),
      useDispatch: jest.fn(),
    };
  });
  
  // Helper to set the mock implementation of useSelector:
  export const setMockUseSelectorState = (state: any) => {
    const { useSelector } = require('react-redux') as { useSelector: jest.Mock };
    useSelector.mockImplementation((selector: any) => selector(state));
  };
  
  export const setMockUseDispatchReturnValue = (dispatchFn: jest.Mock) => {
    const { useDispatch } = require('react-redux') as { useDispatch: jest.Mock };
    (useDispatch as jest.Mock).mockReturnValue(dispatchFn);
};