import React from "react";
import {Issuer} from "./Issuer";
import {useSelector} from "react-redux";
import {IssuerObject} from "../../types/data";
import {RootState} from "../../types/redux";
import {useTranslation} from "react-i18next";
import {EmptyListContainer} from "../Common/EmptyListContainer";
import {RequestStatus} from "../../hooks/useFetch";
import {SpinningLoader} from "../Common/SpinningLoader";
import {IssuersListProps} from "../../types/components";
import {HeaderTile} from "../Common/HeaderTile";

export const IssuersList: React.FC<IssuersListProps> = ({state}) => {
    const issuers = useSelector((state: RootState) => state.issuers);
    const {t} = useTranslation("HomePage");

    if (state === RequestStatus.LOADING) {
        return <SpinningLoader/>
    }

    if(state === RequestStatus.ERROR || !issuers?.filtered_issuers || (issuers?.filtered_issuers && issuers?.filtered_issuers?.length === 0)) {
        return <div data-testid="Issuers-List-Container">
            <HeaderTile content={t("containerHeading")}/>
            <EmptyListContainer content={t("emptyContainerContent")}/>
        </div>
    }

    return <React.Fragment>
        <div data-testid="Issuers-List-Container" className={"mb-20"}>
            <HeaderTile content={t("containerHeading")}/>
            <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {issuers.filtered_issuers.map((issuer: IssuerObject, index: number) =>
                    <Issuer issuer={issuer} key={index} index={index}/>)}
            </div>
        </div>
    </React.Fragment>
}

