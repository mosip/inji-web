import {render, screen} from "@testing-library/react";
import {DataShareHeader} from "../../../components/DataShare/DataShareHeader";
import { renderWithProvider } from "../../../test-utils/mockUtils";
// const renderWithProvider = ()=>{
//     return render(<DataShareHeader title={"title"} subTitle={"subTitle"}/>);

// }
describe("Testing Layout of the Expiry Header", () => {
    
    test("Test Presence of the Outer Container", ()=>{
        const{asFragment} = renderWithProvider(<DataShareHeader title={"title"} subTitle={"subTitle"}/>)
        expect(asFragment()).toMatchSnapshot();
    })
});
describe("Testing Functionality of the Expiry Header",() =>{
    test("Test Presence of the Header Title", ()=>{
        renderWithProvider(<DataShareHeader title={"title"} subTitle={"subTitle"}/>);
        expect(screen.getByTestId("DataShareHeader-Header-Title")).toHaveTextContent("title");
    })
    test("Test Presence of the Header SubTitle", ()=>{
        renderWithProvider(<DataShareHeader title={"title"} subTitle={"subTitle"}/>);
        expect(screen.getByTestId("DataShareHeader-Header-SubTitle")).toHaveTextContent("subTitle");
    })
});
