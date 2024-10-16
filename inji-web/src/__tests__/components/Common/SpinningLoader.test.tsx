import React from 'react';
import { render} from '@testing-library/react';
import {SpinningLoader} from "../../../components/Common/SpinningLoader";



describe("Testing the Layout of Spinning Loader Container",() => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = render(<SpinningLoader />)
        expect(asFragment()).toMatchSnapshot();
    });
})

