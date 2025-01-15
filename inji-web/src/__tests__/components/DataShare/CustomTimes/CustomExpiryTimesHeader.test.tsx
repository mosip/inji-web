import {screen} from "@testing-library/react";
import {CustomExpiryTimesHeader} from "../../../../components/DataShare/CustomExpiryTimes/CustomExpiryTimesHeader";
import { renderWithProvider } from "../../../../test-utils/mockUtils";


describe("Testing the Layout of the Custom Expiry Header", () => {
    test("Check if the layout is matching with the snapshots", ()=>{
        const{asFragment} = renderWithProvider(<CustomExpiryTimesHeader title={"CTHeader"} />)
        expect(asFragment()).toMatchSnapshot();
    })   
});
