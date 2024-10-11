import React from 'react';
import { render} from '@testing-library/react';
import {SpinningLoader} from "../../../components/Common/SpinningLoader";



describe("Test Spinning Loader Container",() => {
    test('check the presence of the container', () => {
        const {asFragment} = render(<SpinningLoader />)
        expect(asFragment()).toMatchSnapshot();
    });
})

