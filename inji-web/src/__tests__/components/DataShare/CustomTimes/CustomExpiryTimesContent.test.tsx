import {fireEvent, screen} from "@testing-library/react";
import {CustomExpiryTimesContent} from "../../../../components/DataShare/CustomExpiryTimes/CustomExpiryTimesContent";
import { mockUseTranslation } from "../../../../test-utils/mockUtils";
import { renderWithProvider } from "../../../../test-utils/mockUtils";
mockUseTranslation();
const expiryMockFn = jest.fn();

describe("Test the Layout of the Custom Expiry Content", () => {

   
    test("Test the presence of the Outer Container", ()=>{
        const{asFragment} = renderWithProvider(<CustomExpiryTimesContent expiryTime={1} setExpiryTime={expiryMockFn} />);
        expect(asFragment()).toMatchSnapshot();
    })
});
describe("Test the  Functionality of custom expiry content",()=>{
    test("Test the Time Range Metrics", ()=>{
        const expiryMockFn = jest.fn();
        renderWithProvider(<CustomExpiryTimesContent expiryTime={1} setExpiryTime={expiryMockFn} />);
        const ctDocument = screen.getByTestId("CustomExpiryTimesContent-Times-Metrics");
        expect(ctDocument).toBeInTheDocument();
        expect(ctDocument).toHaveTextContent("Times");
    })

    test("Test the Time Range Increase on Clicking the Increase Button", ()=>{
        const expiryTime=1;
        const expiryMockFn = jest.fn(()=> expiryTime+1);
        renderWithProvider(<CustomExpiryTimesContent expiryTime={expiryTime} setExpiryTime={expiryMockFn} />);
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
        renderWithProvider(<CustomExpiryTimesContent expiryTime={expiryTime} setExpiryTime={expiryMockFn} />);
        const increaseValueButton = screen.getByTestId("CustomExpiryTimesContent-Times-Range-Decrease");
        const valueDiv = screen.getByTestId("CustomExpiryTimesContent-Times-Value");
        expect(valueDiv).toHaveValue(expiryTime + "");
        fireEvent.click(increaseValueButton);
        expect(expiryMockFn).toHaveBeenCalledTimes(1);
        expect(expiryMockFn).toHaveBeenCalledWith(expiryTime -1);
    })
});
