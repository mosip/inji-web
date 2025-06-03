import React from 'react';
import {render} from '@testing-library/react';
import {PageTitle} from '../../../components/Common/PageTitle/PageTitle';

describe('PageTitle Component', () => {
    it('should match snapshot', () => {
        const {asFragment} = render(
            <PageTitle value="Test Page Title" testId="test-page"/>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render with correct value and test ID', () => {
        const {getByTestId} = render(
            <PageTitle value="Test Page Title" testId="test-page"/>
        );

        const titleElement = getByTestId('title-test-page');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveTextContent('Test Page Title');
        expect(titleElement).toHaveClass('text-2xl font-medium');
    });
});