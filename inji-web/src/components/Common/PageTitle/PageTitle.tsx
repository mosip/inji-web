import React from "react";
import {PageTitleStyles} from "./PageTitleStyles.ts";

type PageTitleProps = {
    value: string;
    testId: string;
};

export function PageTitle({value, testId}: Readonly<PageTitleProps>) {
    return (
        <span
            data-testid={`title-${testId}`}
            className={PageTitleStyles.title}
        >
            {value}
        </span>
    );
}