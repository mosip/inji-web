import React from 'react';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {BackgroundDecorator} from '../../../components/Common/BackgroundDecorator';

jest.mock('../../../assets/Logomark.png', () => 'mocked-logo-path');

const renderComponent = (props = {}) => {
    return render(<BackgroundDecorator {...props} />);
};

describe('BackgroundDecorator Component', () => {
    test('matches snapshot with default props', () => {
        const {asFragment} = renderComponent();

        expect(asFragment()).toMatchSnapshot();
    });

    test('matches snapshot with custom props', () => {
        const {asFragment} = renderComponent({
            logoAlt: 'Custom Logo Alt',
            circleCount: 4,
            topOffset: 100,
            baseRadius: 80,
            testId: 'custom-decorator',
            logoTestId: 'custom-logo'
        });

        expect(asFragment()).toMatchSnapshot();
    });

    test('renders the component with default test ID', () => {
        renderComponent();

        expect(screen.getByTestId('background-decorator')).toBeInTheDocument();
    });

    test('renders the component with custom test ID', () => {
        renderComponent({testId: 'custom-decorator'});

        expect(screen.getByTestId('custom-decorator')).toBeInTheDocument();
    });

    test('renders concentric circles based on the provided count value', () => {
        const count = 3;
        const testId = 'circle-test';
        renderComponent({circleCount: count, testId});

        for (let i = 0; i < count; i++) {
            expect(
                screen.getByTestId(`${testId}-circle-${i}`)
            ).toBeInTheDocument();
        }
    });

    test('uses custom topOffset for positioning the circle container', () => {
        const topOffset = 200;
        renderComponent({topOffset});

        const circleContainer = screen
            .getByTestId('background-decorator')
            .querySelector('div');

        expect(circleContainer).toHaveStyle(`top: ${topOffset}px`);
    });

    test('uses custom baseRadius for circles', () => {
        const baseRadius = 50;
        const testId = 'radius-test';
        renderComponent({baseRadius, testId, circleCount: 1});

        const firstCircle = screen.getByTestId(`${testId}-circle-0`);

        expect(firstCircle).toHaveStyle(`width: ${baseRadius}px`);
        expect(firstCircle).toHaveStyle(`height: ${baseRadius}px`);
    });
});
