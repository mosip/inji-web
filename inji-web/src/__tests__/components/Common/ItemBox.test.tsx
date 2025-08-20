import React from 'react';
import {fireEvent, screen} from '@testing-library/react';
import {ItemBox} from "../../../components/Common/ItemBox";
import { renderWithProvider } from '../../../test-utils/mockUtils';

const clickHandler = jest.fn();

describe("Testing the Layouts of ItemBox", () => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} testId='test-item-box'/>);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality ItemBox", () => {
    test('Check if content is rendered properly', () => {
        renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} testId='test-item-box'/>);
        expect(screen.getByTestId("ItemBox-Outer-Container-1-test-item-box")).toHaveTextContent("TitleOfItemBox");
    });

    test('Check if item box onClick handler is working', () => {
        renderWithProvider(<ItemBox index={1} url={"/"} title={"TitleOfItemBox"} onClick={clickHandler} testId='test-item-box'/>);
        fireEvent.click(screen.getByTestId("ItemBox-Outer-Container-1-test-item-box"));
        expect(clickHandler).toBeCalled();
    });
});
