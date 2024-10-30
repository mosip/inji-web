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
import {GradientWrapper} from "../Common/GradientWrapper";

export const IssuersList: React.FC<IssuersListProps> = ({state}) => {
    const issuers = useSelector((state: RootState) => state.issuers);
    const {t} = useTranslation("IssuersPage");

    if (state === RequestStatus.LOADING) {
        return <GradientWrapper><SpinningLoader/></GradientWrapper>
    }

    if(state === RequestStatus.ERROR || !issuers?.filtered_issuers || (issuers?.filtered_issuers && issuers?.filtered_issuers?.length === 0)) {
        return <div data-testid="Issuers-List-Container" className={" flex flex-col items-center justify-center"}>
            <HeaderTile content={t("containerHeading")} subContent={t("containerSubHeading")}/>
            <EmptyListContainer content={t("emptyContainerContent")}/>
        </div>
    }


    return <React.Fragment>
        <div data-testid="Issuers-List-Container" className={"flex flex-col items-center justify-center"}>
            <HeaderTile content={t("containerHeading")} subContent={t("containerSubHeading")}/>
            <div className={`flex flex-wrap gap-3 p-4 pb-20 justify-center`}>
                {issuers.filtered_issuers.map((issuer: IssuerObject, index: number) =>
                    <div className={`flex items-center justify-center`}>
                        <Issuer issuer={issuer} key={index} index={index}/>
                    </div>)
                }
            </div>
        </div>
    </React.Fragment>
}
