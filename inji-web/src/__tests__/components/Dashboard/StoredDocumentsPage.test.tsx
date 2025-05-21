import {screen} from '@testing-library/react';
import {StoredDocumentsPage} from '../../../pages/Dashboard/StoredDocumentsPage';
import { renderWithRouter } from '../../../test-utils/mockUtils';

jest.mock('../../../components/Dashboard/EmptyDocument', () => ({
    EmptyDocument: () => <div data-testid="mock-empty-document" />
}));

describe('Testing the Layout of StoredDocumentsPage ->', () => {
    it('check if the layout is matching with snapshot', () => {
        const {container} = renderWithRouter(<StoredDocumentsPage />);

        expect(container).toMatchSnapshot();
    });

    it('should render EmptyDocument without crashing', () => {
        renderWithRouter(<StoredDocumentsPage />);

        expect(screen.getByTestId('mock-empty-document')).toBeInTheDocument();
    });
});
