import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {ConfirmationModal} from '../../modals/ConfirmationModal';
import {mockUseTranslation} from "../../test-utils/mockUtils";

mockUseTranslation()

describe('ConfirmationModal Component', () => {
    const defaultProps = {
        title: 'Confirmation Title',
        message: 'Are you sure you want to proceed?',
        onConfirm: jest.fn(),
        onCancel: jest.fn(),
        testId: 'test-modal'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('matches snapshot', () => {
        const {asFragment} = render(<ConfirmationModal {...defaultProps} />);

        expect(asFragment()).toMatchSnapshot();
    });

    it('displays the correct title and message', () => {
        render(<ConfirmationModal {...defaultProps} />);

        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
        expect(screen.getByTestId(`title-${defaultProps.testId}`)).toHaveTextContent(defaultProps.title);
        expect(screen.getByTestId(`sub-title-${defaultProps.testId}`)).toHaveTextContent(defaultProps.message);
    });

    it('calls onCancel when cancel button is clicked', () => {
        render(<ConfirmationModal {...defaultProps} />);

        const cancelButton = screen.getByRole('button', {name: "Cancel"});
        fireEvent.click(cancelButton);

        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
        expect(defaultProps.onConfirm).not.toHaveBeenCalled();
        expect(screen.getByTestId('btn-cancel')).toBe(cancelButton);
    });

    it('calls onConfirm when confirm button is clicked', () => {
        render(<ConfirmationModal {...defaultProps} />);

        const confirmButton = screen.getByRole('button', {name: "Confirm"});
        fireEvent.click(confirmButton);

        expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
        // After confirmation, onCancel is called to close the modal
        expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('btn-confirm')).toBe(confirmButton);
    });

    it('has the correct modal test ID', () => {
        render(<ConfirmationModal {...defaultProps} />);

        expect(screen.getByTestId(`modal-confirm-${defaultProps.testId}`)).toBeInTheDocument();
    });
});