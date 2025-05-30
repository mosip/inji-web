import React, {Fragment} from "react";

type FlatListProps<T> = {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    numColumns?: number;
    keyExtractor: (item: T) => string;
    dataTestId: string;
};

export function FlatList<T>({
                                data,
                                renderItem,
                                numColumns = 1,
                                keyExtractor,
                                dataTestId
                            }: Readonly<FlatListProps<T>>) {
    const smCols = Math.max(1, Math.floor(numColumns / 3));
    const mdCols = Math.max(1, Math.floor((numColumns * 2) / 3));
    const gridStyle = `grid grid-cols-1 sm:grid-cols-${smCols} md:grid-cols-${mdCols} lg:grid-cols-${numColumns} w-full`;


    return (
        <div className={gridStyle} data-testid={dataTestId}>
            {data.map((item) => (
                <Fragment key={keyExtractor(item)}>
                    {renderItem(item)}
                </Fragment>
            ))}
        </div>
    );
}
