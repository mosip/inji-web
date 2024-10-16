import {fireEvent, screen} from "@testing-library/react";
import {DataShareContent} from "../../../components/DataShare/DataShareContent";
import { renderWithProvider } from "../../../test-utils/mockUtils";

const customMockFn = jest.fn();

describe("Testing  the Layout of the Expiry Content", () => {

    test("Check if the layout is matching with the snapshots", ()=>{
        const{asFragment} = renderWithProvider(<DataShareContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setIsCustomExpiryInTimesModalOpen={customMockFn} />)
        expect(asFragment()).toMatchSnapshot();
    })
  
    test("Check the Validity Times Dropdown should not show custom as selected option at first", ()=>{
        renderWithProvider(<DataShareContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setIsCustomExpiryInTimesModalOpen={customMockFn} />);
        const selectedDocument = screen.getByTestId("DataShareContent-Selected-Validity-Times");
        expect(selectedDocument).not.toHaveTextContent("Custom");
        expect(selectedDocument).toHaveTextContent("Once");
        const document = screen.queryByTestId("DataShareContent-Validity-Times-DropDown");
        expect(document).not.toBeInTheDocument();
    })
    test.skip("Check the Validity Times Dropdown should option when custom is selected", ()=>{
        renderWithProvider(<DataShareContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setIsCustomExpiryInTimesModalOpen={customMockFn} />);
        let selectedDocument = screen.getByTestId("DataShareContent-Selected-Validity-Times");
        fireEvent.click(selectedDocument);
        const customValidityDocument = screen.getByTestId("DataShareContent-Validity-Times-DropDown-Custom");
        fireEvent.click(customValidityDocument);
        selectedDocument = screen.getByTestId("DataShareContent-Selected-Validity-Times");
        expect(selectedDocument).toHaveTextContent("Custom");
        const document = screen.getByTestId("DataShareContent-Validity-Times-DropDown");
        expect(document).toBeInTheDocument();
        expect(document.children.length).toBe(4);
    })
})
