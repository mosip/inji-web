import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {SearchBar} from "../../../components/Common/SearchBar/SearchBar";


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
                testId={"test-search-bar"}
            />);
            expect(asFragment()).toMatchSnapshot();
        });
    });

    it('should render with placeholder text', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter} testId={"test-search-bar"}/>);

        expect(screen.getByPlaceholderText('Search test')).toBeInTheDocument();
        expect(screen.getByTestId('icon-search')).toBeInTheDocument();
    });

    it('should call filter function when text is entered', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter} testId={"test-search-bar"}/>);

        const input = screen.getByTestId('input-search');
        fireEvent.change(input, {target: {value: 'test query'}});

        expect(mockFilter).toHaveBeenCalledWith('test query');
        expect(input).toHaveValue('test query');
    });

    it('should display clear icon when text is entered', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter} testId={"test-search-bar"}/>);
        const input = screen.getByTestId('input-search');

        expect(screen.queryByTestId('icon-search-bar-clear')).not.toBeInTheDocument();

        fireEvent.change(input, {target: {value: 'test query'}});

        expect(screen.getByTestId('icon-search-bar-clear')).toBeInTheDocument();
    });

    it('should clear search and call filter with empty string when clear icon is clicked', () => {
        render(<SearchBar placeholder="Search test" filter={mockFilter} testId={"test-search-bar"}/>);
        const input = screen.getByTestId('input-search');

        fireEvent.change(input, {target: {value: 'test query'}});
        fireEvent.click(screen.getByTestId('icon-search-bar-clear'));

        expect(mockFilter).toHaveBeenCalledWith('');
    });
});