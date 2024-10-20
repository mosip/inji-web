// reduxMockUtils.ts
let mockReduxState: any = {};

export const setReduxState = (state: any) => {
    mockReduxState = state;
};

export const clearReduxState = () => {
    mockReduxState = {};
};

export const getMockReduxState = () => mockReduxState;

// Mock react-redux hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: (selector: any) => selector(mockReduxState),
    useDispatch: () => jest.fn()
}));