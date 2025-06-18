import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { Instruction } from '../../../components/Common/Instruction/Instruction';

describe('Instruction', () => {
    const instructionItems = [
        { id: 'item-1', content: 'First instruction' },
        { id: 'item-2', content: <span>Second <strong>instruction</strong></span> }
    ];
    const question = 'What should I do?';
    const testId = 'test-instruction';

    it('should match instruction component snapshot', () => {
        const { asFragment } = render(
            <Instruction
                instructionItems={instructionItems}
                question={question}
                testId={testId}
            />
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders the question with correct text and test id', () => {
        render(
            <Instruction
                instructionItems={instructionItems}
                question={question}
                testId={testId}
            />
        );

        expect(screen.getByText(question)).toBeInTheDocument();
        expect(screen.getByTestId(`text-test-instruction-question`)).toBeInTheDocument();
    });

    it('renders the info icon with correct test id', () => {
        render(
            <Instruction
                instructionItems={instructionItems}
                question={question}
                testId={testId}
            />
        );

        expect(screen.getByTestId(`icon-test-instruction-instruction`)).toBeInTheDocument();
    });

    it('renders the instruction list with correct role and test id', () => {
        render(
            <Instruction
                instructionItems={instructionItems}
                question={question}
                testId={testId}
            />
        );

        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getByTestId(`text-test-instruction-instruction-content`)).toBeInTheDocument();
    });

    it('renders all instruction items with correct text and test ids', () => {
        render(
            <Instruction
                instructionItems={instructionItems}
                question={question}
                testId={testId}
            />
        );

        expect(screen.getByTestId("item-1")).toBeInTheDocument();
        expect(screen.getByText('First instruction')).toBeInTheDocument();
        expect(screen.getByTestId("item-2")).toBeInTheDocument();
        const secondInstruction = screen.getByTestId('item-2');
        expect(within(secondInstruction).getByText('Second')).toBeInTheDocument();
        expect(within(secondInstruction).getByText('instruction', { selector: 'strong' })).toBeInTheDocument();
    });

    it('renders the container with correct test id', () => {
        render(
            <Instruction
                instructionItems={instructionItems}
                question={question}
                testId={testId}
            />
        );

        expect(screen.getByTestId(`text-test-instruction-instruction`)).toBeInTheDocument();
    });
});