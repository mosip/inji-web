import {render, screen} from '@testing-library/react';
import {Footer} from '../../../components/PageTemplate/Footer';
import {createRefElement} from '../../../test-utils/mockUtils';

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    }),
    initReactI18next: {
        type: '3rdParty',
        init: jest.fn()
    }
}));

describe('Testing the Layout of Footer Container', () => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = render(<Footer footerRef={createRefElement()} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe('Testing the functionality of Footer Container', () => {
    test('Check if the image is rendered properly', () => {
        render(<Footer footerRef={createRefElement()} />);
        const imageElement = screen.getByAltText('a square mosip logo');
        expect(imageElement).toBeInTheDocument();
        expect(imageElement).toHaveAttribute(
            'src',
            'https://api.collab.mosip.net/inji/mosip-logo.png'
        );
    });
});