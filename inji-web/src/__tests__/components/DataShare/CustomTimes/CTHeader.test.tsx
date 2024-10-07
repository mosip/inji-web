import {render, screen} from "@testing-library/react";
import {CTHeader} from "../../../../components/DataShare/CustomTimes/CTHeader";

describe("Test the Layout of the Custom Expiry Header", () => {

    beforeEach( ()=> {
        render(<CTHeader title={"CTHeader"} />);
    } )

    test("Test the presence of the Outer Container", ()=>{
        const document = screen.getByTestId("CTHeader-Outer-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Title Content", ()=>{
        const document = screen.getByTestId("CTHeader-Title-Content");
        expect(document).toBeInTheDocument();
    })
    test("Test to Have the content", ()=>{
        const document = screen.getByTestId("CTHeader-Title-Content");
        expect(document).toHaveTextContent("CTHeader");
    })
})
