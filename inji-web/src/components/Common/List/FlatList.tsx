import React, {Fragment} from "react";

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
    const gridStyle = `grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-1`;

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
        <div className={gridStyle} data-testid={testId}>
            {data.map((item) => (
                <Fragment key={keyExtractor(item)}>
                    {renderItem(item)}
                </Fragment>
            ))}
        </div>
    );
}
