import {screen, fireEvent, within} from "@testing-library/react";
import {DataShareExpiryModal} from "../../../modals/DataShareExpiryModal";
import {
    mockUseTranslation,
    renderWithProvider
} from "../../../test-utils/mockUtils";

describe("Testing DataShareExpiryModal functionality", () => {
    beforeEach(() => {
        mockUseTranslation();
    });

    test("should render updated validity count in DataShareExpiryModal when count is updated with custom validity option", () => {
        const mockProps = {
            credentialName: "Test Credential",
            credentialLogo: "Test Logo",
            onSuccess: jest.fn(),
            onCancel: jest.fn()
        };

        renderWithProvider(<DataShareExpiryModal {...mockProps} />);
        expect(
            screen.getByTestId("DataShareContent-Selected-Validity-Times")
        ).toHaveTextContent("Once");
        fireEvent.click(screen.getByTestId("times-dropdown"));

        const validityTimesDropDownButton = screen.getByTestId(
            "DataShareContent-Validity-Times-DropDown-Custom"
        );
        fireEvent.click(validityTimesDropDownButton);

        const customTimesValidityOption = screen.getByTestId(
            "CustomExpiryTimesContent-Times-Value"
        );
        fireEvent.change(customTimesValidityOption, {target: {value: "4"}});

        const customExpiryModalFooter = screen.getByTestId(
            "DataShareFooter-Outer-Container-custom-expiry-modal"
        );
        const customExpriyModalFooterSuccessButton = within(
            customExpiryModalFooter
        ).getByTestId("DataShareFooter-Success-Button");
        fireEvent.click(customExpriyModalFooterSuccessButton);

        expect(
            screen.getByTestId("DataShareContent-Selected-Validity-Times")
        ).toHaveTextContent("4");
    });
});
