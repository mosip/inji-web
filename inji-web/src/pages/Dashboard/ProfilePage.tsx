import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser.tsx';
import { navigateToDashboardHome } from './utils';
import { NavBackArrowButton } from './NavBackArrowButton.tsx';
import { InfoField } from '../../components/Dashboard/InfoField.tsx';
import { TertiaryButton } from '../../components/Common/Buttons/TertiaryButton.tsx';
import { CircleSkeleton } from '../../components/Dashboard/CircleSkeleton.tsx';
import { InfoFieldSkeleton } from '../../components/Dashboard/InfoFieldSkeleton.tsx';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('Dashboard');
  const { user, isLoading } = useUser();
  const location = useLocation();
  const previousPagePath = location.state?.from;

  const handleBackClick = () => {
    if (previousPagePath) {
      navigate(previousPagePath);
    } else {
      navigateToDashboardHome(navigate);
    }
  };

  const renderProfilePicture = () => {
    return isLoading ? (
      <CircleSkeleton
        size="min-w-[80px] min-h-[80px] md:min-w-[150px] md:min-h-[150px]"
        className="sm:m-7 flex-shrink-0"
      />
    ) : (
      <img
        data-testid="profile-page-picture"
        alt="Profile"
        className="rounded-full sm:m-7 flex-shrink-0 min-w-[80px] min-h-[80px] md:min-w-[150px] md:min-h-[150px] object-cover"
        src={user?.profilePictureUrl}
      />
    );
  };
  
  const renderInfoFields = () => {
    return isLoading ? (
      <>
        <InfoFieldSkeleton width="w-2/4" height="h-3" className="mb-12" />
        <InfoFieldSkeleton width="w-3/4" height="h-3" className="my-4" />
      </>
    ) : (
      <>
        <InfoField
          testId="full-name"
          label={t('ProfilePage.fullName')}
          value={user?.displayName}
        />
        <InfoField
          testId="value"
          label={t('ProfilePage.emailAddress')}
          value={user?.email}
        />
      </>
    );
  };
  
  return (
    <div className="container mx-auto sm:px-2 md:px-4 lg:px-6 py-6 relative ml-3 sm:ml-0">
        
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-4 sm:gap-0">
        <div className="flex items-start">
          <NavBackArrowButton onBackClick={handleBackClick} />
          <div className="flex flex-col items-start">
            <span data-testid="profile-page" className="text-2xl font-medium">
              {t('ProfilePage.title')}
            </span>
            <TertiaryButton
              testId="profile-page"
              onClick={() => navigateToDashboardHome(navigate)}
              title={t('ProfilePage.homeTitle')}
            />
          </div>
        </div>
      </div>

      {/* Main profile section */}
      <div className={`flex flex-col items-center md:flex-row space-y-5 md:space-x-10 bg-white p-5 rounded-lg shadow-xl`}>
        <div>{renderProfilePicture()}</div>

        <hr
          data-testid="profile-page-horizontal-rule"
          className="w-[90%] md:hidden border-t border-gray-200"
        />

        <div className="w-full flex flex-col space-y-4 flex-grow">
          {renderInfoFields()}
        </div>
      </div>
    </div>
  );
};
