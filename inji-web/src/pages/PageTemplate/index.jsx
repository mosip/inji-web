import React, {useEffect, useState} from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import {useLocation, useNavigate} from "react-router-dom";
import {getUrlParamsMap} from "../../utils/misc";
import {DATA_KEY_IN_LOCAL_STORAGE} from "../../utils/config";
import AlertMessage from "../../components/utils/AlertMessage";

function PageTemplate({children}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState(location?.state?.error);
    const [showAlert, setShowAlert] = useState(!!location?.state?.error);

    useEffect(() => {
        if (location.pathname !== "/") return;
        let searchParamsMap = getUrlParamsMap(location.search);
        if (Object.keys(searchParamsMap).indexOf("code") !== -1) {
            let sessionState = searchParamsMap["state"];
            let vcRedirectionDetails = JSON.parse(localStorage.getItem(DATA_KEY_IN_LOCAL_STORAGE) || "{}");
            if (!sessionState || !vcRedirectionDetails || vcRedirectionDetails["state"].contains(sessionState) === -1 ) {
                console.error('invalid state');
                navigate("/", {
                    state: {
                        error: "Invalid session. Redirected to home page"
                    }
                });
                return;
            }
            if (vcRedirectionDetails) {
                navigate(`issuers/${vcRedirectionDetails.issuerId}/certificate/${vcRedirectionDetails.certificateId}` + location.search, {
                    state: {
                        issuerDisplayName: vcRedirectionDetails.issuerDisplayName
                    }
                });
            }
        }
    }, []);
    return (
        <div data-testid='page-template' style={{width: '100%', paddingBottom: "40px"}}>
            <Navbar/>
            {children}
            <Footer/>
            <AlertMessage
                message={error}
                severity='error'
                handleClose={() => {
                    setShowAlert(false);
                }}
                open={showAlert}/>
        </div>
    );
}

export default PageTemplate;
