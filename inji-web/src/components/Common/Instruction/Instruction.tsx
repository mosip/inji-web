import React from "react";
import {InstructionStyles} from "./InstructionStyles";
import {InfoIcon} from "../Icons/InfoIcon";
import {InstructionItem} from "../../../types/data";

interface InstructionContentProps {
    instructionItems: InstructionItem[];
    testId: string;
}

const InstructionQuestion: React.FC<{ content: string, testId: string }> = ({content, testId}) => {
    return (
        <p className={InstructionStyles.instructionQuestion} data-testid={testId}>
            {content}
        </p>
    );
}

const InstructionContent: React.FC<InstructionContentProps> = ({
                                                                          instructionItems,
                                                                          testId
                                                                      }) => {
    return (
        <ul data-testid={testId} className={InstructionStyles.instructionContent}>
            {instructionItems.map((item) =>
                <li
                    key={item.id}
                    data-testid={item.id}
                    className={InstructionStyles.instructionText}
                >
                    {item.content}
                </li>
            )}
        </ul>
    );
};

export const Instruction: React.FC<{
    instructionItems: InstructionItem[];
    question: string;
    testId: string;
}> = ({instructionItems, question, testId}) =>
    <div className={InstructionStyles.container} data-testid={`text-${testId}-instruction`}>
        <div className={"flex gap-2 items-center align-middle w-full"}>
            <InfoIcon
                testId={`icon-${testId}-instruction`}
                className="mt-[0.1rem]"
            />
            <InstructionQuestion content={question} testId={`text-${testId}-question`}/>
        </div>
        <InstructionContent
            instructionItems={instructionItems}
            testId={`text-${testId}-instruction-content`}
        />
    </div>
