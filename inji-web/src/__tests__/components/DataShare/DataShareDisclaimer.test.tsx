import {render, screen} from "@testing-library/react";
import {DataShareDisclaimer} from "../../../components/DataShare/DataShareDisclaimer";

describe("Testing Layout of the Disclaimer", () => {
    test("Test the presence of the Outer Container", ()=>{
        render(<DataShareDisclaimer content={"Disclaimer"} />);
        const document = screen.getByTestId("DataShareDisclaimer-Outer-Container");
        expect(document).toBeInTheDocument();
        expect(document).toHaveTextContent("Disclaimer");
    })
})
