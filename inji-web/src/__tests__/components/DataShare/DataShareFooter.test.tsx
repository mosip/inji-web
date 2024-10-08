import {fireEvent, render, screen} from "@testing-library/react";
import {DataShareFooter} from "../../../components/DataShare/DataShareFooter";

describe("Testing Layout of the Expiry Footer", () => {

    const successMockFn = jest.fn();
    const cancelMockFn = jest.fn();
    beforeEach(() => {
        jest.mock("react-i18next", () => ({
            useTranslation: () => ({
                t: (key: string) => key,
            }),
        }));
        render(<DataShareFooter success={"success"} onSuccess={successMockFn} cancel={"cancel"} onCancel={cancelMockFn} />);
    } )

    test("Test the presence of the Outer Container", ()=>{
        const document = screen.getByTestId("DataShareFooter-Outer-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Cancel Button", ()=>{
        const document = screen.getByTestId("DataShareFooter-Cancel-Button");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Success Button", ()=>{
        const document = screen.getByTestId("DataShareFooter-Success-Button");
        expect(document).toBeInTheDocument();
    })

    test("Test whether success button is invoked on clicking", ()=>{
        const successButton = screen.getByTestId("DataShareFooter-Success-Button");
        fireEvent.click(successButton);
        expect(successMockFn).toBeCalled();
        expect(cancelMockFn).not.toBeCalled();
    })

    test("Test whether cancel button is invoked on clicking", ()=>{
        const cancelButton = screen.getByTestId("DataShareFooter-Cancel-Button");
        fireEvent.click(cancelButton);
        expect(successMockFn).not.toBeCalled();
        expect(cancelMockFn).toBeCalled();
    })
})
