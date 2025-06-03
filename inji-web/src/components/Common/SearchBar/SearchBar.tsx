import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import {IoCloseCircleSharp} from "react-icons/io5";
import {SearchBarStyles} from "./SearchBarStyles";

type SearchBarProps = {
    placeholder: string;
    filter: (searchText: string) => void;
    testId: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        placeholder,
                                                        filter,
                                                        testId
                                                    }: SearchBarProps) => {
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
        filter(event.target.value)
    };

    const clearSearch = () => {
        setSearchText("");
        filter("");
    };

    return (
        <div
            data-testid={`${testId}-container`}
            className={SearchBarStyles.container}
        >
            <FaSearch
                data-testid="icon-search"
                color={"var(--iw-color-searchIcon)"}
                className={SearchBarStyles.icon}
                size={22}
            />
            <input
                data-testid="input-search"
                type="text"
                value={searchText}
                placeholder={placeholder}
                onChange={handleSearch}
                className={SearchBarStyles.input}
            />
            {searchText.length > 0 && (
                <IoCloseCircleSharp
                    data-testid={"icon-search-bar-clear"}
                    onClick={clearSearch}
                    color={"var(--iw-color-closeIcon)"}
                    className={SearchBarStyles.clearIcon}
                    size={26}
                />
            )}
        </div>
    );
};