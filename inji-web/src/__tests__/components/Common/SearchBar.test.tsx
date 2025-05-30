import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {SearchBar} from "../../../components/Common/SearchBar";


describe('SearchBar Component', () => {
    const mockFilter = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Testing the Layout of HeaderTile", () => {
        //TODO: Snapshot tests will be unskipped at last once UI is fully ready
        test.skip('Check if the layout is matching with the snapshots', () => {
            const {asFragment} = render(<SearchBar
                placeholder="Search test"
                filter={mockFilter}
            />);
            expect(asFragment()).toMatchSnapshot();
        });
    });

    it('should render with placeholder text', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter}/>);

        expect(screen.getByPlaceholderText('Search test')).toBeInTheDocument();
        expect(screen.getByTestId('icon-search')).toBeInTheDocument();
    });

    it('should call filter function when text is entered', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter}/>);

        const input = screen.getByTestId('input-search');
        fireEvent.change(input, {target: {value: 'test query'}});

        expect(mockFilter).toHaveBeenCalledWith('test query');
        expect(input).toHaveValue('test query');
    });

    it('should display clear icon when text is entered', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter}/>);

        const input = screen.getByTestId('input-search');

        // Initially clear icon should not be visible
        expect(screen.queryByTestId('NavBar-Search-Clear-Icon')).not.toBeInTheDocument();

        // Enter text
        fireEvent.change(input, {target: {value: 'test query'}});

        // Clear icon should now be visible
        expect(screen.getByTestId('NavBar-Search-Clear-Icon')).toBeInTheDocument();
    });

    it('should clear search and call filter with empty string when clear icon is clicked', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter}/>);

        const input = screen.getByTestId('input-search');

        // Enter text
        fireEvent.change(input, {target: {value: 'test query'}});

        // Clear the search
        fireEvent.click(screen.getByTestId('NavBar-Search-Clear-Icon'));

        // Filter should be called with empty string
        expect(mockFilter).toHaveBeenCalledWith('');
    });

    it('should apply correct styling to the search container', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter}/>);

        const container = screen.getByTestId('Search-Issuer-Container');
        expect(container).toHaveClass('w-full sm:w-96 flex justify-center items-center bg-iw-background shadow-iw');
    });

    it('should have proper styling for the input field', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter}/>);

        const input = screen.getByTestId('input-search');
        expect(input).toHaveClass('py-6 w-11/12 flex text-iw-searchTitle focus:outline-none overflow-ellipsis mr-10');
    });
});