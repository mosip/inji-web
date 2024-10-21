import React from 'react';
import { render, screen } from '@testing-library/react';
import {IntroBox} from "../../../components/Common/IntroBox";

describe("Testing the Layout of IntroBox",() => {
    test('Check if the layout is matching with the snapshots', () => {
        const {asFragment} = render(<IntroBox/>);
        expect(asFragment()).toMatchSnapshot();
    });
})


describe("Testing the Fuctionality of IntroBox",() => {
    test('Check if content is rendered properly', () => {
        render(<IntroBox />);
        const headerElement = screen.getByTestId("IntroBox-Text");
        expect(headerElement).toHaveTextContent("Intro.title")
    });
    test('Check if content is rendered properly subTitle', () => {
        render(<IntroBox />);
        const headerElement = screen.getByTestId("IntroBox-SubText");
        expect(headerElement).toHaveTextContent("Intro.subTitle")
    });
})
