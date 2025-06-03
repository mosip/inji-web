import React from 'react';
import {render, screen} from '@testing-library/react';
import {InfoSection} from '../../../components/Common/Info/InfoSection';

function MockIcon() {
    return <svg data-testid="mock-icon"/>;
}

describe('InfoSection Component', () => {
    it('should match snapshot with all props', () => {
        const {container} = render(
            <InfoSection
                title="Test Title"
                message="Test Action Text"
                icon={<MockIcon/>}
                testId="test-info-section"
            />
        );

        expect(container).toMatchSnapshot();
    });

    it('should match snapshot with minimal props', () => {
        const {container} = render(
            <InfoSection message="Test Action Text Only" testId="test-info-section"/>
        );

        expect(container).toMatchSnapshot();
    });

    it('should render with all props', () => {
        render(
            <InfoSection
                title="Test Title"
                message="Test Action Text"
                icon={<MockIcon/>}
                testId="test-info-section"
            />
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText('Test Action Text')).toBeInTheDocument();
        expect(screen.getByTestId('test-info-section-title')).toHaveTextContent('Test Title');
        expect(screen.getByTestId("test-info-section-message")).toHaveTextContent('Test Action Text');
        expect(document.querySelector('svg')).toBeInTheDocument();
    });

    it('should render only with actionText', () => {
        render(
            <InfoSection message="Only Action Text" testId="test-info-section"/>
        );

        expect(screen.queryByTestId('test-info-section-title')).not.toBeInTheDocument();
        expect(screen.getByText('Only Action Text')).toBeInTheDocument();
        expect(screen.getByTestId("test-info-section-message")).toHaveTextContent('Only Action Text');
        expect(document.querySelector('svg')).not.toBeInTheDocument();
    });

    it('should render only with title', () => {
        render(
            <InfoSection title="Only Title" testId="test-info-section"/>
        );

        expect(screen.getByTestId('test-info-section-title')).toBeInTheDocument();
        expect(screen.getByTestId('test-info-section-title')).toHaveTextContent('Only Title');
        expect(screen.queryByText('Test Action Text')).not.toBeInTheDocument();
        expect(document.querySelector('svg')).not.toBeInTheDocument();
    });

    it('should render only with icon', () => {
        render(
            <InfoSection icon={<MockIcon/>} testId="test-info-section"/>
        );

        expect(screen.queryByTestId('test-info-section-title')).not.toBeInTheDocument();
        expect(document.querySelector('svg')).toBeInTheDocument();
    });
});