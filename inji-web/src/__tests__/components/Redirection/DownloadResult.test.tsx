import React from 'react';
import {render, screen} from '@testing-library/react';
import {DownloadResult} from "../../../components/Redirection/DownloadResult";
import {RequestStatus} from "../../../hooks/useFetch";
import { renderWithProvider } from '../../../test-utils/mockUtils';

jest.mock('../../../components/Common/SpinningLoader', () => ({
    SpinningLoader: () => <div data-testid={"SpinningLoader-Container"}/>,
}))

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => ({
        navigate: mockedUsedNavigate,
    }),
}))

describe("DownloadResult Container",() => {
    test('check the presence of the container', () => {
        render(<DownloadResult title={"Title"} subTitle={"SubTitle"} state={RequestStatus.DONE}/>);
        let redirectionElement = screen.getByTestId("DownloadResult-Outer-Container");
        expect(redirectionElement).toBeInTheDocument();
        redirectionElement = screen.getByTestId("DownloadResult-Title");
        expect(redirectionElement).toHaveTextContent("Title")
        redirectionElement = screen.getByTestId("DownloadResult-SubTitle");
        expect(redirectionElement).toHaveTextContent("SubTitle")
    });
})

describe("DownloadResult Layout check for Success Error and Loading", () => {

    test('checking the Layout for the Success',()=>{
        const {asFragment} = renderWithProvider(<DownloadResult title={"Title"} subTitle={"SubTitle"} state={RequestStatus.DONE}/>)
        expect(asFragment()).toMatchSnapshot();
    });
    test('checking the Layout for the Error',()=>{
        const {asFragment} = renderWithProvider(<DownloadResult title={"Title"} subTitle={"SubTitle"} state={RequestStatus.ERROR}/>)
        expect(asFragment()).toMatchSnapshot();
    })
    test('checking the Layout for the Loading',()=>{
        const {asFragment} = renderWithProvider(<DownloadResult title={"Title"} subTitle={"SubTitle"} state={RequestStatus.LOADING}/>)
        expect(asFragment()).toMatchSnapshot();
    })
});