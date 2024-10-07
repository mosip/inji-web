import {render, screen} from "@testing-library/react";
import {ModalWrapper} from "../../modals/ModalWrapper";
import {DSHeader} from "../../components/DataShare/DSHeader";
import {DSFooter} from "../../components/DataShare/DSFooter";
import React from "react";
import {DSContent} from "../../components/DataShare/DSContent";
import {reduxStore} from "../../redux/reduxStore";
import {Provider} from "react-redux";

describe("Test the Layout of the Modal Wrapper", () => {

    const customMockFn = jest.fn();
    beforeEach(() => {
        render(
            <Provider store={reduxStore}>
            <ModalWrapper header={<DSHeader title={"title"} subTitle={"subTitle"}/>}
                             content={<DSContent credentialName={"credentialName"} credentialLogo={"credentialLogo"} setCustom={jest.fn()}/>}
                             footer={<DSFooter cancel={"cancel"} success={"success"} onSuccess={jest.fn()} onCancel={jest.fn()}/>}
                             size={"3xl"}
                             zIndex={40} />
            </Provider>)
    })

    test("Test the presence of the Outer Container", ()=>{
        const document = screen.getByTestId("ModalWrapper-Outer-Container");
        expect(document).toBeInTheDocument();
    })
    test("Test the presence of the Inner Container", ()=>{
        const document = screen.getByTestId("ModalWrapper-Inner-Container");
        expect(document).toBeInTheDocument();
        expect(document.children.length).toBe(3)
    })
    test("Test the presence of the Back Drop", ()=>{
        const document = screen.getByTestId("ModalWrapper-BackDrop");
        expect(document).toBeInTheDocument();
    })

})
