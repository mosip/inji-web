import React, { useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useLocation, useNavigate} from 'react-router-dom';
import {NavBackArrowButton} from '../../../components/Common/Buttons/NavBackArrowButton';
import {InfoField} from '../../../components/Common/InfoField';
import {navigateToUserHome} from "../../../utils/navigationUtils";
import {TertiaryButton} from '../../../components/Common/Buttons/TertiaryButton';
import {CircleSkeleton} from '../../../components/Common/CircleSkeleton';
import {InfoFieldSkeleton} from '../../../components/Common/InfoFieldSkeleton';
import {ProfilePageStyles} from "./ProfilePageStyles";
import {useApi} from "../../../hooks/useApi";
import {User} from "../../../types/data";
import {RequestStatus} from "../../../utils/constants";
import {api} from "../../../utils/api";
import {ErrorDisplay} from "../../../components/Error/ErrorDisplay";
import {BorderedButton} from "../../../components/Common/Buttons/BorderedButton";

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation('User', {
        keyPrefix: "ProfilePage"
    });
    const { t: commonTranslation } = useTranslation('common');
    const location = useLocation();
    const previousPagePath = location.state?.from;
    const {state, data, fetchData, error} = useApi<User>()

    useEffect(() => {
        async function fetchProfileInfo() {
            await fetchData({
                apiConfig: api.fetchUserProfile
            })
        }

        void fetchProfileInfo()
    }, []);

    const handleBackClick = () => {
        if (previousPagePath) {
            navigate(previousPagePath);
        } else {
            navigateToUserHome(navigate);
        }
    };

    const renderProfilePicture = () => {
        return state === RequestStatus.LOADING ? (
            <CircleSkeleton
                size={ProfilePageStyles.profilePictureSkeleton}
                className="sm:m-7 flex-shrink-0"
            />
        ) : (
            <img
                data-testid="profile-page-picture"
                alt="Profile"
                className={ProfilePageStyles.profilePicture}
                src={data?.profilePictureUrl}
            />
        );
    };

    const renderInfoFields = () => {
        return state === RequestStatus.LOADING ? (
            <>
                <InfoFieldSkeleton width="w-2/4" height="h-3" className="mb-12"/>
                <InfoFieldSkeleton width="w-3/4" height="h-3" className="my-4"/>
            </>
        ) : (
            <>
                <InfoField
                    testId="full-name"
                    label={t('fullName')}
                    value={data?.displayName}
                />
                <InfoField
                    testId="email"
                    label={t('emailAddress')}
                    value={data?.email}
                />
            </>
        );
    };

    function handleGoToHome() {
        navigateToUserHome(navigate)
    }

    return (
        <div className={ProfilePageStyles.container}>
            <div className={ProfilePageStyles.headerContainer}>
                <div className={ProfilePageStyles.headerLeftSection}>
                    <NavBackArrowButton onBackClick={handleBackClick}/>
                    <div className={ProfilePageStyles.headerTitleContainer}>
            <span data-testid="profile-page" className={ProfilePageStyles.pageTitle}>
              {t('title')}
            </span>
                        <TertiaryButton
                            testId="home"
                            onClick={() => navigateToUserHome(navigate)}
                            title={t('homeTitle')}
                        />
                    </div>
                </div>
            </div>

            {/* Main profile section */}
            {error ? (<ErrorDisplay message={t('error.title')}
                                    helpText={t('error.message')}
                                    testId={"profile"}
                                    action={<BorderedButton title={commonTranslation('goToHome')}
                                                     onClick={handleGoToHome}
                                                     testId={"btn-go-to-home"}
                             />}
            />) : (
                <div
                    className={"flex flex-col items-center align-middle justify-center md:flex-row space-y-5 md:space-x-10 bg-white p-5 rounded-lg shadow-xl"}>
                    <div>{renderProfilePicture()}</div>

                    <hr
                        data-testid="profile-page-horizontal-rule"
                        className={ProfilePageStyles.horizontalDivider}
                    />

                    <div className={ProfilePageStyles.infoContainer}>
                        {renderInfoFields()}
                    </div>
                </div>
            )}
        </div>
    )
};
