import {AuthorizationPage} from "../../pages/AuthorizationPage";
import {renderWithRouter, mockWindowLocation} from "../../test-utils/mockUtils";

jest.mock("../../utils/api", () => ({
  api: {
    mimotoHost: "http://mocked-api-host"
  }
}));

describe('Testing the Layouts of AuthorizationPage', () => {
  test('Check if it renders properly if there is no error in URL', () => {
    mockWindowLocation('https://api.collab.mosip.net');
    const {asFragment} = renderWithRouter(<AuthorizationPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('Check if it shows error messages if error in URL', () => {
    mockWindowLocation('https://api.collab.mosip.net?error=some_error');
    const{asFragment} = renderWithRouter(<AuthorizationPage />);
    expect(asFragment()).toMatchSnapshot();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
