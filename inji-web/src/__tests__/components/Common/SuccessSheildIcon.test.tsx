import { SuccessSheildIcon } from '../../../components/Common/SuccessSheildIcon';
import { renderWithProvider } from '../../../test-utils/mockUtils';

describe("Testing the Layout of SuccessSheildIcon", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = renderWithProvider(<SuccessSheildIcon />)
        expect(asFragment()).toMatchSnapshot();
    });
});
