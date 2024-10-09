import {fireEvent, render, screen} from "@testing-library/react";
import {DataShareContent} from "../../../components/DataShare/DataShareContent";
import {reduxStore} from "../../../redux/reduxStore";
import {Provider} from "react-redux";
import {mockUseTranslation} from "../../../utils/mockUtils";

describe("Test the Layout of the Expiry Content", () => {

    const customMockFn = jest.fn();
    beforeEach(() => {
        mockUseTranslation();
        render(<Provider store={reduxStore}>
            <DataShareContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setIsCustomExpiryInTimesModalOpen={customMockFn} />
        </Provider>);
    } )

    test("Test the presence of the Outer Container", ()=>{
        const document = screen.getByTestId("DataShareContent-Outer-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Outer Title", ()=>{
        const document = screen.getByTestId("DataShareContent-Outer-Title");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Issuer Logo", ()=>{
        const document = screen.getByTestId("DataShareContent-Issuer-Logo");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Issuer Name", ()=>{
        const document = screen.getByTestId("DataShareContent-Issuer-Name");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Consent Container", ()=>{
        const document = screen.getByTestId("DataShareContent-Consent-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test the Validity Times Dropdown should not show custom as selected option at first", ()=>{
        const selectedDocument = screen.getByTestId("DataShareContent-Selected-Validity-Times");
        expect(selectedDocument).not.toHaveTextContent("Custom");
        expect(selectedDocument).toHaveTextContent("Once");
        const document = screen.queryByTestId("DataShareContent-Validity-Times-DropDown");
        expect(document).not.toBeInTheDocument();
    })
    test.skip("Test the Validity Times Dropdown should option when custom is selected", ()=>{
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
