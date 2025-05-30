import React from "react";

type PageTitleProps = {
    value: string;
    testId: string;
};

export function PageTitle({value, testId}: Readonly<PageTitleProps>) {
    return (
        <span
            data-testid={`title-${testId}`}
            className="text-2xl font-medium"
        >
            {value}
        </span>
    );
}