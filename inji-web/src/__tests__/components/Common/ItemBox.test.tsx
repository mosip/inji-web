import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {ItemBox} from "../../../components/Common/ItemBox";
import { renderWithProvider } from '../../../test-utils/mockUtils';

const clickHandler = jest.fn();

describe("Testing the Layouts of ItemBox", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality ItemBox", () => {
    test('Check if content is rendered properly', () => {
        renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        expect(screen.getByTestId("ItemBox-Outer-Container-1")).toHaveTextContent("TitleOfItemBox");
    });

    test('Check if item box onClick handler is working', () => {
        renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} />);
        fireEvent.click(screen.getByTestId("ItemBox-Outer-Container-1"));
        expect(clickHandler).toBeCalled();
    });
});
