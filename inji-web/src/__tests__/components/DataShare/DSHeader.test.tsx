import {render, screen} from "@testing-library/react";
import {DSHeader} from "../../../components/DataShare/DSHeader";

describe("Testing Layout of the Expiry Header", () => {
    beforeEach(()=>{
        render(<DSHeader title={"title"} subTitle={"subTitle"}/>);
    })
    test("Test Presence of the Outer Container", ()=>{
        const document = screen.getByTestId("DSHeader-Outer-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test Presence of the Header Title", ()=>{
        const document = screen.getByTestId("DSHeader-Header-Title");
        expect(document).toBeInTheDocument();
        expect(document).toHaveTextContent("title");
    })
    test("Test Presence of the Header SubTitle", ()=>{
        const document = screen.getByTestId("DSHeader-Header-SubTitle");
        expect(document).toBeInTheDocument();
        expect(document).toHaveTextContent("subTitle");
    })
})
