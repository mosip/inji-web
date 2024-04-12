import React from 'react';
import GridComponent from "../../components/molecules/GridComponent";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import {SampleIssuersData} from '../Home/testData';
import {DATA_KEY_IN_LOCAL_STORAGE, getESignetRedirectURL} from "../../utils/config";
import {generateCodeChallenge, generateRandomString} from "../../utils/oauth-utils";
import CustonDownloadButton from "../../components/atoms/CustomDownloadButton.js";


export const issuerDetails = SampleIssuersData;

const CertificatesBox = styled(Box)`
    margin: 30px auto;
    max-width: 1140px;
    
`;

const Title = styled(Typography)`
    font: normal normal 600 20px/16px Inter;
    margin-bottom: 10px;
`;

const getCardsData = (issuerId, issuerDisplayName, authEndpoint, credentialList, clientId) => {
    return credentialList.map(cred => {
        return {
            imageUrl: cred.display[0].logo.url,
            title: cred.display[0].name,
            icon: <CustonDownloadButton/>,
            onClick: () => {
                let {codeVerifier, codeChallenge} = generateCodeChallenge();
                let state = generateRandomString();
                localStorage.setItem(DATA_KEY_IN_LOCAL_STORAGE,
                    JSON.stringify({
                        issuerId,
                        issuerDisplayName,
                        certificateId: cred.id,
                        codeVerifier: codeVerifier,
                        state: constructNewState(state),
                        clientId: clientId
                    }));
                window.location.assign(getESignetRedirectURL(authEndpoint, cred.scope, clientId, codeChallenge, state));
            },
            clickable: true
        }
    });
}

const constructNewState = (state) => {

    let oldLocalStorageData = localStorage.getItem(DATA_KEY_IN_LOCAL_STORAGE) ;
    let newState = [state];
    if(oldLocalStorageData !== null){
        oldLocalStorageData = JSON.parse(oldLocalStorageData);
        newState.concat(oldLocalStorageData.state)
    }
    return newState;
}

function CertificateList({issuerId, issuerDisplayName, authEndpoint, credentialList, clientId}) {
    const cards = getCardsData(issuerId, issuerDisplayName, authEndpoint, credentialList, clientId);
    return (
        <CertificatesBox>
            <Title variant='h6'>
                List of Credentials
            </Title>
            <GridComponent cards={cards}/>
        </CertificatesBox>
    );
}

export default CertificateList;
