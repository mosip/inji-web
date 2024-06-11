import React from "react";
import {getObjectForCurrentLanguage} from "../../utils/i18n";
import {useNavigate} from "react-router-dom";
import {ItemBox} from "../Common/ItemBox";
import {IssuerProps} from "../../types/components";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";

export const Issuer: React.FC<IssuerProps> = ({issuer, index}) => {
    const language = useSelector((state: RootState) => state.common.language);
    const issuerDisplayObject = getObjectForCurrentLanguage(issuer.display, language);
    const navigate = useNavigate();
    return <React.Fragment>
        <ItemBox index={index}
                 url={issuerDisplayObject?.logo.url}
                 title={issuerDisplayObject?.name}
                 description={issuerDisplayObject?.description}
                 onClick={() => navigate(`/issuers/${issuer.credential_issuer}`)}/>
    </React.Fragment>
}

