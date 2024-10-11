import {screen} from "@testing-library/react";
import {CustomExpiryTimesHeader} from "../../../../components/DataShare/CustomExpiryTimes/CustomExpiryTimesHeader";
import { renderWithProvider } from "../../../../test-utils/mockUtils";


describe("Test the Layout of the Custom Expiry Header", () => {
    test("Test the presence of the Outer Container", ()=>{
        const{asFragment} = renderWithProvider(<CustomExpiryTimesHeader title={"CTHeader"} />)
        expect(asFragment()).toMatchSnapshot();
    })
   
});
describe("Test the functionality of custom expiry Header",()=>{
    test("Test to Have the content", ()=>{
        renderWithProvider(<CustomExpiryTimesHeader title={"CTHeader"} />);
        const document = screen.getByTestId("CustomExpiryTimesHeader-Title-Content");
        expect(document).toHaveTextContent("CTHeader");
    })
});
