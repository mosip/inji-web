import {mockNavigateFn } from '../../../test-utils/mockRouter';
import {render, screen} from '@testing-library/react';
import {DownloadResult} from "../../../components/Redirection/DownloadResult";
import {RequestStatus} from "../../../hooks/useFetch";
import { renderWithProvider,mockUseSpinningLoader } from '../../../test-utils/mockUtils';
mockUseSpinningLoader();

describe("Testing the Layout of DownloadResult for Success Error and Loading", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigateFn.mockReset();
      });

    test('Check if the layout is matching with the snapshots for the Success',()=>{
        const {asFragment} = renderWithProvider(<DownloadResult title={"Title"} subTitle={"SubTitle"} state={RequestStatus.DONE}/>)
        expect(asFragment()).toMatchSnapshot();
    });
    test('Check if the layout is matching with the snapshots for the Error',()=>{
        const {asFragment} = renderWithProvider(<DownloadResult title={"Title"} subTitle={"SubTitle"} state={RequestStatus.ERROR}/>)
        expect(asFragment()).toMatchSnapshot();
    })
    test('Check if the layout is matching with the snapshots for the Loading',()=>{
        const {asFragment} = renderWithProvider(<DownloadResult title={"Title"} subTitle={"SubTitle"} state={RequestStatus.LOADING}/>)
        expect(asFragment()).toMatchSnapshot();
    })
});

describe("Testing the Functionality of DownloadResult Container",() => {
    test('Check the presence of the container', () => {
        render(<DownloadResult title={"Title"} subTitle={"SubTitle"} state={RequestStatus.DONE}/>);
        let redirectionElement = screen.getByTestId("DownloadResult-Outer-Container");
        expect(redirectionElement).toBeInTheDocument();
        redirectionElement = screen.getByTestId("DownloadResult-Title");
        expect(redirectionElement).toHaveTextContent("Title")
        redirectionElement = screen.getByTestId("DownloadResult-SubTitle");
        expect(redirectionElement).toHaveTextContent("SubTitle")
    });
    afterEach(()=>{
        jest.clearAllMocks();
    })
})