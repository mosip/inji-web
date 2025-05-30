import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import {IoCloseCircleSharp} from "react-icons/io5";

type SearchBarProps = {
    placeholder: string;
    filter: (searchText: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        placeholder,
                                                        filter
                                                    }: SearchBarProps) => {
    const [searchText, setSearchText] = useState("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
        filter(event.target.value)
    };

    return (
        <div
            data-testid="Search-Issuer-Container"
            className={`w-full sm:w-96 flex justify-center items-center bg-iw-background shadow-iw`}
        >
            <FaSearch
                data-testid="icon-search"
                color={"var(--iw-color-searchIcon)"}
                className={"m-5"}
                size={22}
            />
            <input
                data-testid="input-search"
                type="text"
                value={searchText}
                placeholder={placeholder}
                onChange={handleSearch}
                className="py-6 w-11/12 flex text-iw-searchTitle focus:outline-none overflow-ellipsis mr-10"
            />
            {searchText.length > 0 && (
                <IoCloseCircleSharp
                    data-testid="NavBar-Search-Clear-Icon"
                    onClick={() => filter("")}
                    color={"var(--iw-color-closeIcon)"}
                    className={"m-5"}
                    size={26}
                />
            )}
        </div>
    );
};
