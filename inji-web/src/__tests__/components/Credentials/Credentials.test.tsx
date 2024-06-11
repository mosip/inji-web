import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {Credential} from "../../../components/Credentials/Crendential";
import {CredentialWellknownObject, DisplayArrayObject, LogoObject} from "../../../types/data";
import {Provider} from "react-redux";
import {reduxStore} from "../../../redux/reduxStore";
import {getObjectForCurrentLanguage} from "../../../utils/i18n";

global.window._env_ = {
    DEFAULT_FAVICON: "favicon.ico",
    DEFAULT_FONT_URL: "",
    DEFAULT_THEME: "purple_theme",
    DEFAULT_TITLE: "Inji Web Test",
    DEFAULT_LANG: 'en'
};

const getCredentialObject = (): CredentialWellknownObject => {
    return {
        format: "ldp_vc",
        id: "id",
        scope: "mosip_ldp_vc",
        display: {
            name: "Name",
            language: "en",
            locale: "en",
            logo: {
                url: "https://url.com",
                alt_text: "alt text of the url"
            },
            title: "Title",
            description: "Description",
        }
    }
};

describe.skip("Test Credentials Item Layout",() => {
    test('check the presence of the container', () => {
        const clickHandler = jest.fn();
        const credential: CredentialWellknownObject = getCredentialObject();
        jest.spyOn(require('../../../utils/i18n'), 'getObjectForCurrentLanguage').mockReturnValue(credential.display[0]);
        render(
            <Provider store={reduxStore}>
                <Credential credential={credential} index={1} />
            </Provider>
        );
        const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container");
        expect(itemBoxElement).toBeInTheDocument();
    });
    // test('check if content is rendered properly', () => {
    //     const clickHandler = jest.fn();
    //     const credential:CredentialWellknownObject = getCredentialObject();
    //     render(<Credential credential={credential} index={1} />);
    //     const itemBoxElement = screen.getByTestId("ItemBox-Outer-Container");
    //     expect(itemBoxElement).toHaveTextContent("TitleOfItemBox")
    // });
});
