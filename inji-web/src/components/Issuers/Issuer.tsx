import React from "react";
import {getIssuerDisplayObjectForCurrentLanguage} from "../../utils/i18n";
import {useNavigate} from "react-router-dom";
import {ItemBox} from "../Common/ItemBox";
import {IssuerProps} from "../../types/components";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {IssuerWellknownDisplayArrayObject} from "../../types/data";
import {useUser} from "../../hooks/User/useUser";
import {ROUTES} from "../../utils/constants";

export const Issuer: React.FC<IssuerProps> = ({issuer, index}) => {
    const language = useSelector((state: RootState) => state.common.language);
    const issuerDisplayObject: IssuerWellknownDisplayArrayObject = getIssuerDisplayObjectForCurrentLanguage(issuer.display, language);
    const navigate = useNavigate();
    const {isUserLoggedIn} = useUser();
    const credentialsPagePath = isUserLoggedIn()
        ? ROUTES.USER_ISSUER(issuer.issuer_id)
        : ROUTES.ISSUER(issuer.issuer_id);

    return (
        <ItemBox index={index}
                 url={issuerDisplayObject?.logo?.url}
                 title={issuerDisplayObject?.name}
                 description={issuerDisplayObject?.description}
                 onClick={() => navigate(credentialsPagePath)}
                 testId={issuer.issuer_id}
        />
    )
}

