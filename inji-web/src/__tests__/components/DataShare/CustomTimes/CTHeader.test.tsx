import {render, screen} from "@testing-library/react";
import {CustomExpiryTimesHeader} from "../../../../components/DataShare/CustomExpiryTimes/CustomExpiryTimesHeader";

describe("Test the Layout of the Custom Expiry Header", () => {

    beforeEach( ()=> {
        render(<CustomExpiryTimesHeader title={"CTHeader"} />);
    } )

    test("Test the presence of the Outer Container", ()=>{
        const document = screen.getByTestId("CustomExpiryTimesHeader-Outer-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Title Content", ()=>{
        const document = screen.getByTestId("CustomExpiryTimesHeader-Title-Content");
        expect(document).toBeInTheDocument();
    })
    test("Test to Have the content", ()=>{
        const document = screen.getByTestId("CustomExpiryTimesHeader-Title-Content");
        expect(document).toHaveTextContent("CTHeader");
    })
})
