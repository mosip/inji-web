import React from 'react';
import { screen } from '@testing-library/react';
import { SuccessSheildIcon } from '../../../components/Common/SuccessSheildIcon';
import { renderWithProvider } from '../../../test-utils/mockUtils';

describe("Testing the Layout of SuccessSheildIcon", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = renderWithProvider(<SuccessSheildIcon />)
        expect(asFragment()).toMatchSnapshot();
    });
});
describe("Testing the Functionality of SuccessSheildIcon" ,() =>{
    test('Check the icon color of SuccessSheildIcon component', () => {
        renderWithProvider(<SuccessSheildIcon />);
        expect(screen.getByTestId("DownloadResult-Success-ShieldIcon")).toHaveAttribute('color', 'var(--iw-color-shieldSuccessIcon)');
    });

});
