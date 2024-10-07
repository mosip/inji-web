import {render, screen} from "@testing-library/react";
import {DSDisclaimer} from "../../../components/DataShare/DSDisclaimer";

describe("Testing Layout of the Disclaimer", () => {
    test("Test the presence of the Outer Container", ()=>{
        render(<DSDisclaimer content={"Disclaimer"} />);
        const document = screen.getByTestId("DSDisclaimer-Outer-Container");
        expect(document).toBeInTheDocument();
        expect(document).toHaveTextContent("Disclaimer");
    })
})
