//TODO: Move everything from this file to mockUtils.tsx 
// Currently if doing this, then storage mock is not being recognized by some test cases for i18n.test.tsx;
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
