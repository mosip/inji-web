import React from 'react';
import { render, screen } from '@testing-library/react';
import {IntroBox} from "../../../components/Common/IntroBox";



describe("Test Intro Box Layout",() => {
    test('check the presence of the container', () => {
        render(<IntroBox />);
        const introBoxElement = screen.getByTestId("IntroBox-Container");
        expect(introBoxElement).toBeInTheDocument();
    });
    test('check the presence of the title', () => {
        render(<IntroBox />);
        const introBoxElement = screen.getByTestId("IntroBox-Text");
        expect(introBoxElement).toBeInTheDocument();
    });
    test('check the presence of the subTitle', () => {
        render(<IntroBox />);
        const introBoxElement = screen.getByTestId("IntroBox-SubText");
        expect(introBoxElement).toBeInTheDocument();
    });
})


describe("Test Intro Box Content",() => {
    test('check if content is rendered properly', () => {
        render(<IntroBox />);
        const headerElement = screen.getByTestId("IntroBox-Text");
        expect(headerElement).toHaveTextContent("Intro.title")
    });
    test('check if content is rendered properly subTitle', () => {
        render(<IntroBox />);
        const headerElement = screen.getByTestId("IntroBox-SubText");
        expect(headerElement).toHaveTextContent("Intro.subTitle")
    });
})
