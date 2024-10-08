import {fireEvent, render, screen} from "@testing-library/react";
import {CustomExpiryTimesContent} from "../../../../components/DataShare/CustomExpiryTimes/CustomExpiryTimesContent";
import {useTranslation} from "react-i18next";
import {mockUseTranslation} from "../../../../utils/mockUtils";

describe("Test the Layout of the Custom Expiry Content", () => {

    beforeEach(() => {
        mockUseTranslation();
    } )

    test("Test the presence of the Outer Container", ()=>{
        const expiryMockFn = jest.fn();
        render(<CustomExpiryTimesContent expiryTime={1} setExpiryTime={expiryMockFn} />);
        const ctDocument = screen.getByTestId("CustomExpiryTimesContent-Outer-Container");
        expect(ctDocument).toBeInTheDocument();
    })
    test("Test the presence of the Time Range Container", ()=>{
        const expiryMockFn = jest.fn();
        render(<CustomExpiryTimesContent expiryTime={1} setExpiryTime={expiryMockFn} />);
        const ctDocument = screen.getByTestId("CustomExpiryTimesContent-Times-Range-Container");
        expect(ctDocument).toBeInTheDocument();
    })
    test("Test the presence of the Time Range Increase Container", ()=>{
        const expiryMockFn = jest.fn();
        render(<CustomExpiryTimesContent expiryTime={1} setExpiryTime={expiryMockFn} />);
        const ctDocument = screen.getByTestId("CustomExpiryTimesContent-Times-Range-Increase");
        expect(ctDocument).toBeInTheDocument();
    })
    test("Test the presence of the Time Range Decrease Container", ()=>{
        const expiryMockFn = jest.fn();
        render(<CustomExpiryTimesContent expiryTime={1} setExpiryTime={expiryMockFn} />);
        const ctDocument = screen.getByTestId("CustomExpiryTimesContent-Times-Range-Decrease");
        expect(ctDocument).toBeInTheDocument();
    })
    test("Test the presence of the Time Range Value", ()=>{
        const expiryMockFn = jest.fn();
        render(<CustomExpiryTimesContent expiryTime={1} setExpiryTime={expiryMockFn} />);
        const ctDocument = screen.getByTestId("CustomExpiryTimesContent-Times-Value");
        expect(ctDocument).toBeInTheDocument();
    })
    test("Test the presence of the Time Range Metrics", ()=>{
        const expiryMockFn = jest.fn();
        render(<CustomExpiryTimesContent expiryTime={1} setExpiryTime={expiryMockFn} />);
        const ctDocument = screen.getByTestId("CustomExpiryTimesContent-Times-Metrics");
        expect(ctDocument).toBeInTheDocument();
        expect(ctDocument).toHaveTextContent("metrics");
    })

    test("Test the Time Range Increase on Clicking the Increase Button", ()=>{
        const expiryTime=1;
        const expiryMockFn = jest.fn(()=> expiryTime+1);
        render(<CustomExpiryTimesContent expiryTime={expiryTime} setExpiryTime={expiryMockFn} />);
        const increaseValueButton = screen.getByTestId("CustomExpiryTimesContent-Times-Range-Increase");
        const valueDiv = screen.getByTestId("CustomExpiryTimesContent-Times-Value");
        expect(valueDiv).toHaveValue(expiryTime + "");
        fireEvent.click(increaseValueButton);
        expect(expiryMockFn).toHaveBeenCalledTimes(1);
        expect(expiryMockFn).toHaveBeenCalledWith(expiryTime + 1);
    })

    test("Test the Time Range Decrease on Clicking the Decrease Button", ()=>{
        const expiryTime=3;
        const expiryMockFn = jest.fn(()=> expiryTime+1);
        render(<CustomExpiryTimesContent expiryTime={expiryTime} setExpiryTime={expiryMockFn} />);
        const increaseValueButton = screen.getByTestId("CustomExpiryTimesContent-Times-Range-Decrease");
        const valueDiv = screen.getByTestId("CustomExpiryTimesContent-Times-Value");
        expect(valueDiv).toHaveValue(expiryTime + "");
        fireEvent.click(increaseValueButton);
        expect(expiryMockFn).toHaveBeenCalledTimes(1);
        expect(expiryMockFn).toHaveBeenCalledWith(expiryTime -1);
    })
})
