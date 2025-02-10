import { ErrorSheildIcon } from '../../../components/Common/ErrorSheildIcon';
import { renderWithProvider } from '../../../test-utils/mockUtils';

describe("Testing the Layout of ErrorSheildIcon", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const{asFragment} =  renderWithProvider(<ErrorSheildIcon />);
        expect(asFragment()).toMatchSnapshot();
    });
});