import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {ItemBox} from "../../../components/Common/ItemBox";
import { renderWithProvider } from '../../../test-utils/mockUtils';

const clickHandler = jest.fn();

describe("Test Item Box Container Layouts", () => {
    test('check the presence of the container', () => {
        const {asFragment} = renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Test Item Box Container Functionality", () => {
    test('check if content is rendered properly', () => {
        renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        expect(screen.getByTestId("ItemBox-Outer-Container-1")).toHaveTextContent("TitleOfItemBox");
    });

    test('check if item box onClick handler is working', () => {
        renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        fireEvent.click(screen.getByTestId("ItemBox-Outer-Container-1"));
        expect(clickHandler).toBeCalled();
    });
});
