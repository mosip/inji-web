import {render, screen} from "@testing-library/react";
import {DataShareHeader} from "../../../components/DataShare/DataShareHeader";

describe("Testing Layout of the Expiry Header", () => {
    beforeEach(()=>{
        render(<DataShareHeader title={"title"} subTitle={"subTitle"}/>);
    })
    test("Test Presence of the Outer Container", ()=>{
        const document = screen.getByTestId("DataShareHeader-Outer-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test Presence of the Header Title", ()=>{
        const document = screen.getByTestId("DataShareHeader-Header-Title");
        expect(document).toBeInTheDocument();
        expect(document).toHaveTextContent("title");
    })
    test("Test Presence of the Header SubTitle", ()=>{
        const document = screen.getByTestId("DataShareHeader-Header-SubTitle");
        expect(document).toBeInTheDocument();
        expect(document).toHaveTextContent("subTitle");
    })
})
