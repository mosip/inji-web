import {fireEvent, screen} from "@testing-library/react";
import {DataShareFooter} from "../../../components/DataShare/DataShareFooter";
import { mockUseTranslation } from "../../../test-utils/mockUtils";
import { renderWithProvider } from "../../../test-utils/mockUtils";

const successMockFn = jest.fn();
const cancelMockFn = jest.fn();
describe("Testing Layout of the Expiry Footer", () => {
    
    beforeEach(() => {
        mockUseTranslation()
    } )

    test("Check if the layout is matching with the snapshots", ()=>{
        const {asFragment} = renderWithProvider(<DataShareFooter successText={"success"} onSuccess={successMockFn} cancelText={"cancel"} onCancel={cancelMockFn} />);
        expect(asFragment()).toMatchSnapshot();
    })

    test("Check whether success button is invoked on clicking", ()=>{
        renderWithProvider(<DataShareFooter successText={"success"} onSuccess={successMockFn} cancelText={"cancel"} onCancel={cancelMockFn} />);
        const successButton = screen.getByTestId("DataShareFooter-Success-Button");
        fireEvent.click(successButton);
        expect(successMockFn).toBeCalled();
        expect(cancelMockFn).not.toBeCalled();
    })

    test("Check whether cancel button is invoked on clicking", ()=>{
        renderWithProvider(<DataShareFooter successText={"success"} onSuccess={successMockFn} cancelText={"cancel"} onCancel={cancelMockFn} />);
        const cancelButton = screen.getByTestId("DataShareFooter-Cancel-Button");
        fireEvent.click(cancelButton);
        expect(successMockFn).not.toBeCalled();
        expect(cancelMockFn).toBeCalled();
    })
    afterEach(()=>{
        jest.clearAllMocks();
    })
})
