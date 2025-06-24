import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {PasscodeInput} from "../../../../components/Common/Input/PasscodeInput";

describe('PasscodeInput', () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
        label: 'Test Passcode',
        value: ['', '', '', '', '', ''],
        onChange: mockOnChange,
        testId: 'test-passcode-input'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should match the snapshot of PasscodeInput layout', () => {
        const {asFragment} = render(<PasscodeInput {...defaultProps} />);

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders with correct label and empty inputs', () => {
        render(<PasscodeInput {...defaultProps} />);

        expect(screen.getByText('Test Passcode')).toBeInTheDocument();
        expect(screen.getByTestId('test-passcode-input-container')).toBeInTheDocument();

        // Should have 6 input fields and 1 toggle button
        const inputs = screen.getAllByTestId('input-test-passcode-input');
        expect(inputs).toHaveLength(6);
    });

    it('updates value when digit is entered', async () => {
        render(<PasscodeInput {...defaultProps} />);

        const inputs = screen.getAllByTestId('input-test-passcode-input');
        userEvent.type(inputs[0], '1');

        expect(mockOnChange).toHaveBeenCalledWith(['1', '', '', '', '', '']);
    });

    it('moves focus to next input after entering a digit', async () => {
        render(<PasscodeInput {...defaultProps} />);

        const inputs = screen.getAllByTestId('input-test-passcode-input');
        userEvent.type(inputs[0], '1');

        // Focus should move to the next input
        expect(document.activeElement).toBe(inputs[1]);
    });

    it('moves focus to previous input on backspace when current is empty', async () => {
        render(<PasscodeInput {...defaultProps} value={['1', '', '', '', '', '']}/>);

        const inputs = screen.getAllByTestId('input-test-passcode-input');
        inputs[1].focus();

        fireEvent.keyDown(inputs[1], {key: 'Backspace'});

        expect(document.activeElement).toBe(inputs[0]);
    });

    it('prevents non-numeric input', async () => {
        render(<PasscodeInput {...defaultProps} />);

        const inputs = screen.getAllByTestId('input-test-passcode-input');
        userEvent.type(inputs[0], 'a');

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('toggles passcode visibility when eye icon is clicked', async () => {
        render(<PasscodeInput {...defaultProps} />);

        const toggleButton = screen.getByRole('button');
        const inputs = screen.getAllByTestId('input-test-passcode-input');

        // Initially inputs should be password type
        expect(inputs[0]).toHaveAttribute('type', 'password');

        // Click to show passcode
        userEvent.click(toggleButton);
        expect(inputs[0]).toHaveAttribute('type', 'text');
        expect(screen.getByTestId("eye-view")).toBeInTheDocument()

        // Click again to hide passcode
        userEvent.click(toggleButton);
        expect(inputs[0]).toHaveAttribute('type', 'password');
        expect(screen.getByTestId("eye-view-slash")).toBeInTheDocument()
    });

    it('renders with prefilled values', () => {
        render(<PasscodeInput {...defaultProps} value={['1', '2', '3', '4', '5', '6']}/>);

        const inputs = screen.getAllByTestId('input-test-passcode-input');
        expect(inputs[0]).toHaveValue('1');
        expect(inputs[1]).toHaveValue('2');
        expect(inputs[2]).toHaveValue('3');
        expect(inputs[3]).toHaveValue('4');
        expect(inputs[4]).toHaveValue('5');
        expect(inputs[5]).toHaveValue('6');
    });
});