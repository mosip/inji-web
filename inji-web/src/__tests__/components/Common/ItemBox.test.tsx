import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ItemBox} from "../../../components/Common/ItemBox";
describe("Test Item Box Container",() => {
    test('check the presence of the container', () => {
        const clickHandler = jest.fn();
        render(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toBeInTheDocument();
    });
    test('check if content is rendered properly', () => {
        const clickHandler = jest.fn();
        render(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        expect(itemBoxElement).toHaveTextContent("TitleOfItemBox")
    });

    test('check if item box onClick handler is working', () => {
        const clickHandler = jest.fn();
        render(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container-1");
        fireEvent.click(itemBoxElement);
        expect(clickHandler).toBeCalled()
    });
})

