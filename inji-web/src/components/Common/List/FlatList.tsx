import React, {Fragment} from "react";

type FlatListProps<T> = {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    numColumns?: number;
    keyExtractor: (item: T) => string;
    testId: string;
    onEmpty?: React.ReactNode;
};

export function FlatList<T>({
                                data,
                                renderItem,
                                numColumns = 1,
                                keyExtractor,
                                testId,
                                onEmpty
                            }: Readonly<FlatListProps<T>>) {
    const smCols = Math.max(1, Math.floor(numColumns / 3));
    const mdCols = Math.max(1, Math.floor((numColumns * 2) / 3));
    const gridStyle = `grid grid-cols-1 sm:grid-cols-${smCols} md:grid-cols-${mdCols} lg:grid-cols-${numColumns} w-full`;

    if (data.length === 0) {
        if (onEmpty === undefined)
            return <div>No items available</div>
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
