import React, {useEffect} from 'react';
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

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useTranslation('User');
    const location = useLocation();
    const previousPagePath = location.state?.from;
    const {state, data, fetchData} = useApi<User>()

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
                    label={t('ProfilePage.fullName')}
                    value={data?.displayName}
                />
                <InfoField
                    testId="email"
                    label={t('ProfilePage.emailAddress')}
                    value={data?.email}
                />
            </>
        );
    };

    return (
        <div className={ProfilePageStyles.container}>
            <div className={ProfilePageStyles.headerContainer}>
                <div className={ProfilePageStyles.headerLeftSection}>
                    <NavBackArrowButton onBackClick={handleBackClick}/>
                    <div className={ProfilePageStyles.headerTitleContainer}>
            <span data-testid="profile-page" className={ProfilePageStyles.pageTitle}>
              {t('ProfilePage.title')}
            </span>
                        <TertiaryButton
                            testId="home"
                            onClick={() => navigateToUserHome(navigate)}
                            title={t('ProfilePage.homeTitle')}
                        />
                    </div>
                </div>
            </div>

            {/* Main profile section */}
            <div className={ProfilePageStyles.profileSection}>
                <div>{renderProfilePicture()}</div>

                <hr
                    data-testid="profile-page-horizontal-rule"
                    className={ProfilePageStyles.horizontalDivider}
                />

                <div className={ProfilePageStyles.infoContainer}>
                    {renderInfoFields()}
                </div>
            </div>
        </div>
    );
};
