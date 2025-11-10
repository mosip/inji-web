import {AuthorizationPage} from "../../pages/AuthorizationPage";
import {renderWithRouter, mockWindowLocation} from "../../test-utils/mockUtils";

jest.mock("../../utils/api", () => ({
  api: {
    mimotoHost: "http://mocked-api-host", 
  }
}));

describe('Testing the Layouts of AuthorizationPage', () => {
  test('Check if it renders properly if there is no error in URL', () => {
    mockWindowLocation('https://api.collab.mosip.net?resource=datashare&datashare=test');
    const {asFragment} = renderWithRouter(<AuthorizationPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Check if it shows error messages if error in URL', () => {
    mockWindowLocation('https://api.collab.mosip.net?error=some_error');
    const{asFragment} = renderWithRouter(<AuthorizationPage />);
    expect(asFragment()).toMatchSnapshot();
  });

    test('Redirects to mimoto /authorize when resource includes datashare', () => {
        const mockHrefSetter = jest.fn();

        delete (window as any).location;
        (window as any).location = {
            origin: "https://api.collab.mosip.net",
            search: "?resource=datashare",
            assign: jest.fn(),
            set href(value: string) {
                mockHrefSetter(value);
            },
            get href() {
                return "https://api.collab.mosip.net?resource=datashare";
            },
        };

        renderWithRouter(<AuthorizationPage />);
        expect(mockHrefSetter).toHaveBeenCalledWith(
            "http://mocked-api-host/authorize?resource=datashare"
        );
    });

    test('Redirects to /user/authorize when resource does not include datashare', () => {
        const mockHrefSetter = jest.fn();

        delete (window as any).location;
        (window as any).location = {
            origin: "https://api.collab.mosip.net",
            search: "?client_id=test",
            assign: jest.fn(),
            set href(value: string) {
                mockHrefSetter(value);
            },
            get href() {
                return "https://api.collab.mosip.net?client_id=test";
            },
        };

        renderWithRouter(<AuthorizationPage />);
        expect(mockHrefSetter).toHaveBeenCalledWith("/user/authorize?client_id=test");
    });

    test("Keeps single '?' when search starts with '?'", () => {
        const mockHrefSetter = jest.fn();

        delete (window as any).location;
        (window as any).location = {
            origin: "https://api.collab.mosip.net",
            search: "?param=value",
            assign: jest.fn(),
            set href(value: string) {
                mockHrefSetter(value);
            },
            get href() {
                return "https://api.collab.mosip.net?param=value";
            },
        };

        renderWithRouter(<AuthorizationPage />);
        expect(mockHrefSetter).toHaveBeenCalledWith("/user/authorize?param=value");
    });

    test("Adds '?' when search does not start with '?'", () => {
        const mockHrefSetter = jest.fn();

        delete (window as any).location;
        (window as any).location = {
            origin: "https://api.collab.mosip.net",
            search: "param=value", // no leading ?
            assign: jest.fn(),
            set href(value: string) {
                mockHrefSetter(value);
            },
            get href() {
                return "https://api.collab.mosip.net";
            },
        };

        renderWithRouter(<AuthorizationPage />);
        expect(mockHrefSetter).toHaveBeenCalledWith("/user/authorize?param=value");
    });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
