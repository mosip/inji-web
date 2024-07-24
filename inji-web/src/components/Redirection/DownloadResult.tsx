import React from "react";
import {DownloadResultProps} from "../../types/components";
import {RequestStatus} from "../../hooks/useFetch";
import {SpinningLoader} from "../Common/SpinningLoader";
import {ErrorSheildIcon} from "../Common/ErrorSheildIcon";
import {SuccessSheildIcon} from "../Common/SuccessSheildIcon";
import {LandingPageWrapper} from "../Common/LandingPageWrapper";


export const DownloadResult: React.FC<DownloadResultProps> = (props) => {
    return <React.Fragment>
        {props.state === RequestStatus.DONE && <LandingPageWrapper icon={<SuccessSheildIcon />} title={props.title} subTitle={props.subTitle} gotoHome={true}/> }
        {props.state === RequestStatus.ERROR && <LandingPageWrapper icon={<ErrorSheildIcon />} title={props.title} subTitle={props.subTitle} gotoHome={true}/> }
        {props.state === RequestStatus.LOADING && <LandingPageWrapper icon={<SpinningLoader />} title={props.title} subTitle={props.subTitle} gotoHome={false}/> }
    </React.Fragment>
}

