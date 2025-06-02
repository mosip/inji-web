import React, {Fragment} from "react";
import ListStyles from "./ListStyles";

type FlatListProps<T> = {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    keyExtractor: (item: T) => string;
    testId: string;
    onEmpty?: React.ReactNode;
};

export function FlatList<T>({
                                data,
                                renderItem,
                                keyExtractor,
                                testId,
                                onEmpty
                            }: Readonly<FlatListProps<T>>) {

    if (data.length === 0) {
        if (onEmpty === undefined)
            return <div data-testid={"empty-list"}>No items available</div>
        return (
            <Fragment>
                {onEmpty}
            </Fragment>
        )
    }

    return (
        <div className={ListStyles.gridLayout} data-testid={testId}>
            {data.map((item) => (
                <Fragment key={keyExtractor(item)}>
                    {renderItem(item)}
                </Fragment>
            ))}
        </div>
    );
}
