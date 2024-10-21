import {screen} from "@testing-library/react";
import {DataShareHeader} from "../../../components/DataShare/DataShareHeader";
import { renderWithProvider } from "../../../test-utils/mockUtils";

describe("Testing Layout of the Expiry Header", () => {
    
    test("Check if the layout is matching with the snapshots", ()=>{
        const{asFragment} = renderWithProvider(<DataShareHeader title={"title"} subTitle={"subTitle"}/>)
        expect(asFragment()).toMatchSnapshot();
    })
});
describe("Testing Functionality of the Expiry Header",() =>{
    test("Check Presence of the Header Title", ()=>{
        renderWithProvider(<DataShareHeader title={"title"} subTitle={"subTitle"}/>);
        expect(screen.getByTestId("DataShareHeader-Header-Title")).toHaveTextContent("title");
    })
    test("Check Presence of the Header SubTitle", ()=>{
        renderWithProvider(<DataShareHeader title={"title"} subTitle={"subTitle"}/>);
        expect(screen.getByTestId("DataShareHeader-Header-SubTitle")).toHaveTextContent("subTitle");
    })
});
