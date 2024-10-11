import { screen} from "@testing-library/react";
import {DataShareDisclaimer} from "../../../components/DataShare/DataShareDisclaimer";
import { renderWithProvider } from "../../../test-utils/mockUtils";

describe("Testing Layout of the DataShareDisclaimer", () => {
    test("Test the presence of the Outer Container", ()=>{
        const {asFragment} = renderWithProvider(<DataShareDisclaimer content={"Disclaimer"} />)
        expect(asFragment()).toMatchSnapshot();
    })
})
describe("Testing the Functionality of DataShareDisclaimer",()=>{
    test("Test the container to have the content",()=>{
        renderWithProvider(<DataShareDisclaimer content={"Disclaimer"} />);
        expect(screen.getByTestId("DataShareDisclaimer-Outer-Container")).toHaveTextContent("Disclaimer");
    })
})
