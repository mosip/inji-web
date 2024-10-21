import { screen} from "@testing-library/react";
import {DataShareDisclaimer} from "../../../components/DataShare/DataShareDisclaimer";
import { renderWithProvider } from "../../../test-utils/mockUtils";

describe("Testing Layout of the DataShareDisclaimer", () => {
    test("Check if the layout is matching with the snapshots", ()=>{
        const {asFragment} = renderWithProvider(<DataShareDisclaimer content={"Disclaimer"} />)
        expect(asFragment()).toMatchSnapshot();
    })
})
describe("Testing the Functionality of DataShareDisclaimer",()=>{
    test("Check the container to have the content",()=>{
        renderWithProvider(<DataShareDisclaimer content={"Disclaimer"} />);
        expect(screen.getByTestId("DataShareDisclaimer-Outer-Container")).toHaveTextContent("Disclaimer");
    })
})
