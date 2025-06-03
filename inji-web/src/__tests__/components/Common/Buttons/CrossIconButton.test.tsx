import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {CrossIconButton} from '../../../../components/Common/Buttons/CrossIconButton';

jest.mock('../../../../assets/CrossIcon.svg', () => 'mocked-cross-icon-path');

describe('CrossIconButton Component', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    it('matches snapshot with default props', () => {
        const {asFragment} = render(
            <CrossIconButton
                onClick={mockOnClick}
                btnTestId="btn-close-icon"
                iconTestId="icon-close"
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot with custom props', () => {
        const {asFragment} = render(
            <CrossIconButton
                onClick={mockOnClick}
                btnClassName="custom-btn-class"
                iconClassName="custom-icon-class"
                btnTestId="custom-btn-test-id"
                iconTestId="custom-icon-test-id"
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders button with provided btnTestId', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                btnTestId="test-btn-id"
                iconTestId="icon-close"
            />
        );

        expect(screen.getByTestId('test-btn-id')).toBeInTheDocument();
    });

    it('renders icon with provided iconTestId', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                btnTestId="btn-close-icon"
                iconTestId="test-icon-id"
            />
        );

        expect(screen.getByTestId('test-icon-id')).toBeInTheDocument();
    });

    it('renders with default test IDs when not provided', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                btnTestId="btn-close-icon"
                iconTestId="icon-close"
            />
        );

        expect(screen.getByTestId('btn-close-icon')).toBeInTheDocument();
        expect(screen.getByTestId('icon-close')).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                btnTestId="btn-close-icon"
                iconTestId="icon-close"
            />
        );

        fireEvent.click(screen.getByTestId('btn-close-icon'));

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('applies custom button classes', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                btnClassName="test-custom-class"
                btnTestId="btn-close-icon"
                iconTestId="icon-close"
            />
        );

        const button = screen.getByTestId('btn-close-icon');

        expect(button).toHaveClass('test-custom-class');
    });

    it('applies custom icon classes', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                iconClassName="test-icon-class"
                btnTestId="btn-close-icon"
                iconTestId="icon-close"
            />
        );

        const img = screen.getByTestId('icon-close');

        expect(img).toHaveClass('test-icon-class');
    });

    it('renders the cross icon image with correct src', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                btnTestId="btn-close-icon"
                iconTestId="icon-close"
            />
        );

        const imgElement = screen.getByAltText('Close');

        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', 'mocked-cross-icon-path');
    });

    it('has correct button type attribute', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                btnTestId="btn-close-icon"
                iconTestId="icon-close"
            />
        );

        const button = screen.getByTestId('btn-close-icon');

        expect(button).toHaveAttribute('type', 'button');
    });

    it('applies empty string as default class when no className provided', () => {
        render(
            <CrossIconButton
                onClick={mockOnClick}
                btnTestId="btn-close-icon"
                iconTestId="icon-close"
            />
        );

        const button = screen.getByTestId('btn-close-icon');
        const img = screen.getByTestId('icon-close');

        expect(button.className).toBe('');
        expect(img.className).toBe('');
    });
});
