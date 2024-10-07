import {fireEvent, render, screen} from "@testing-library/react";
import {DSContent} from "../../../components/DataShare/DSContent";
import {reduxStore} from "../../../redux/reduxStore";
import {Provider} from "react-redux";

describe("Test the Layout of the Expiry Content", () => {

    const customMockFn = jest.fn();
    beforeEach(() => {
        jest.mock("react-i18next", () => ({
            useTranslation: () => ({
                t: (key: string) => key,
            }),
        }));
        render(<Provider store={reduxStore}>
            <DSContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setCustom={customMockFn} />
        </Provider>);
    } )

    test("Test the presence of the Outer Container", ()=>{
        const document = screen.getByTestId("DSContent-Outer-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Outer Title", ()=>{
        const document = screen.getByTestId("DSContent-Outer-Title");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Issuer Logo", ()=>{
        const document = screen.getByTestId("DSContent-Issuer-Logo");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Issuer Name", ()=>{
        const document = screen.getByTestId("DSContent-Issuer-Name");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Consent Container", ()=>{
        const document = screen.getByTestId("DSContent-Consent-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test the Validity Times Dropdown should not show custom as selected option at first", ()=>{
        const selectedDocument = screen.getByTestId("DSContent-Selected-Validity-Times");
        expect(selectedDocument).not.toHaveTextContent("Custom");
        expect(selectedDocument).toHaveTextContent("Once");
        const document = screen.queryByTestId("DSContent-Validity-Times-DropDown");
        expect(document).not.toBeInTheDocument();
    })
    test.skip("Test the Validity Times Dropdown should option when custom is selected", ()=>{
        let selectedDocument = screen.getByTestId("DSContent-Selected-Validity-Times");
        fireEvent.click(selectedDocument);
        const customValidityDocument = screen.getByTestId("DSContent-Validity-Times-DropDown-Custom");
        fireEvent.click(customValidityDocument);
        selectedDocument = screen.getByTestId("DSContent-Selected-Validity-Times");
        expect(selectedDocument).toHaveTextContent("Custom");
        const document = screen.getByTestId("DSContent-Validity-Times-DropDown");
        expect(document).toBeInTheDocument();
        expect(document.children.length).toBe(4);
    })
})
