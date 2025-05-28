import React from 'react';
import {useTranslation} from 'react-i18next';
import {useLocation,useNavigate} from 'react-router-dom';
import {useUser} from '../../hooks/useUser.tsx';
import {navigateToDashboardHome} from './utils';
import { NavBackArrowButton } from './NavBackArrowButton.tsx';
import { InfoField } from '../../components/Dashboard/InfoField.tsx';

export const ProfilePage: React.FC = () => {
    const navigate=useNavigate();

    const {t} = useTranslation('Dashboard');
    const {user} = useUser();

    const location = useLocation();
    const previousPagePath = location.state?.from;

    const handleBackClick = () => {
        if (previousPagePath) {
            navigate(previousPagePath); // Navigate to the previous link in history
        } else {
            navigateToDashboardHome(navigate); // Navigate to homepage if opened directly
        }
    };

    return (
        <div className="container mx-auto sm:px-2 md:px-4 lg:px-6 py-6 relative ml-3 sm:ml-0">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-4 sm:gap-0">
                    <div className="flex items-start">
                        <div className="flex items-start">
                            <NavBackArrowButton
                                onBackClick={handleBackClick}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <span
                                data-testid={'Profile-Page'}
                                className="text-2xl font-medium"
                            >
                                {t('ProfilePage.title')}
                            </span>
                            <button
                                data-testid={'Home'}
                                className="text-xs sm:text-sm text-[#5B03AD] cursor-pointer"
                                onClick={() => navigateToDashboardHome(navigate)}
                            >
                                {t('Home.title')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col items-center md:flex-row space-y-5 md:space-x-10 bg-white p-5 rounded-lg shadow-xl '>
                    <div>
                        <img
                        data-testid="Profile-Page-Picture"
                        className="rounded-full sm:m-7 flex-shrink-0 min-w-[80px] min-h-[80px] md:min-w-[150px] md:min-h-[150px]"
                        src={user?.profilePictureUrl}></img>
                    </div>
                    <hr data-testid="Profile-Page-Horizontal-Rule" className="w-[90%] md:hidden border-t border-gray-200" />
                    <div className='w-full'>
                        <InfoField label={"Full Name"} value={user?.displayName} />
                        <InfoField label={"Email Address"} value={user?.email} />
                    </div>
                </div>
        </div>
        
    );
};
