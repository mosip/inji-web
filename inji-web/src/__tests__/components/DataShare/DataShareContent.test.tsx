import {fireEvent, render, screen} from "@testing-library/react";
import {DataShareContent} from "../../../components/DataShare/DataShareContent";
import {reduxStore} from "../../../redux/reduxStore";
import {Provider} from "react-redux";
// import {mockUseTranslation} from "../../../utils/mockUtils";
import { mockUseTranslation } from "../../../test-utils/mockUtils";
import { renderWithProvider } from "../../../test-utils/mockUtils";

const customMockFn = jest.fn();

describe("Test the Layout of the Expiry Content", () => {

    
    // const renderWithProvider = ()=>{
    //     return render(<Provider store={reduxStore}>
    //         <DataShareContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setIsCustomExpiryInTimesModalOpen={customMockFn} />
    //     </Provider>);
    // }

    test("Test layout of DataShareContent", ()=>{
        const{asFragment} = renderWithProvider(<DataShareContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setIsCustomExpiryInTimesModalOpen={customMockFn} />)
        expect(asFragment()).toMatchSnapshot();
    })
  
    test("Test the Validity Times Dropdown should not show custom as selected option at first", ()=>{
        renderWithProvider(<DataShareContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setIsCustomExpiryInTimesModalOpen={customMockFn} />);
        const selectedDocument = screen.getByTestId("DataShareContent-Selected-Validity-Times");
        expect(selectedDocument).not.toHaveTextContent("Custom");
        expect(selectedDocument).toHaveTextContent("Once");
        const document = screen.queryByTestId("DataShareContent-Validity-Times-DropDown");
        expect(document).not.toBeInTheDocument();
    })
    test.skip("Test the Validity Times Dropdown should option when custom is selected", ()=>{
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
