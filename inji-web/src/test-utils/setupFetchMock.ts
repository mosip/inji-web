export const fetchMock = jest.fn();

beforeAll(() => {
    global.fetch = fetchMock;
});

beforeEach(() => {
    fetchMock.mockReset();
});
