import React from 'react';
import { screen } from '@testing-library/react';
import { SuccessSheildIcon } from '../../../components/Common/SuccessSheildIcon';
import { renderWithProvider } from '../../../test-utils/mockUtils';

describe("Test SuccessSheildIcon Component", () => {
    test('checks the presence of SuccessSheildIcon component', () => {
        const {asFragment} = renderWithProvider(<SuccessSheildIcon />)
        expect(asFragment()).toMatchSnapshot();
    });
});
describe("Test SuccessSheildIcon Functionality" ,() =>{
    test('checks the icon color of SuccessSheildIcon component', () => {
        renderWithProvider(<SuccessSheildIcon />);
        expect(screen.getByTestId("DownloadResult-Success-ShieldIcon")).toHaveAttribute('color', 'var(--iw-color-shieldSuccessIcon)');
    });

});
