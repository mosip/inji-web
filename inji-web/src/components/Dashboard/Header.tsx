import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {LanguageSelector} from '../Common/LanguageSelector';
import {api} from '../../utils/api';
import {useCookies} from 'react-cookie';
import {toast} from 'react-toastify';
import {
    convertStringIntoPascalCase,
    navigateToDashboardHome
} from '../../pages/Dashboard/utils';
import {useUser} from '../../hooks/useUser';
import {DashboardHeaderProps, DropdownItem} from './types';
import HamburgerMenu from '../../assets/HamburgerMenu.svg';
import {isRTL} from '../../utils/i18n';
import {useSelector} from 'react-redux';
import {RootState} from '../../types/redux';
import {useTranslation} from 'react-i18next';
import {getProfileInitials} from './Utils';
import DropdownArrowIcon from '../Common/DropdownArrowIcon';
import {KEYS} from '../../utils/constants';

export const Header: React.FC<DashboardHeaderProps> = ({
    headerRef,
    headerHeight
}) => {
    const language = useSelector((state: RootState) => state.common.language);
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState<string | undefined>(
        undefined
    );
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hamburgerMenuRef = useRef<HTMLImageElement>(null);
    const {user, removeUser} = useUser();
    const displayNameFromLocalStorage = user?.displayName;
    const hasProfilePictureUrl = user?.profilePictureUrl;
    const {t} = useTranslation('Dashboard');

    useEffect(() => {
        setDisplayName(displayNameFromLocalStorage);
    }, [displayNameFromLocalStorage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setIsProfileDropdownOpen(false);
            }

            if (
                hamburgerMenuRef.current &&
                !hamburgerMenuRef.current.contains(target)
            ) {
                setIsHamburgerMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () =>
            document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const apiRequest = api.userLogout;
            const response = await fetch(apiRequest.url(), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                }
            });

            if (response.ok) {
                removeUser();
                localStorage.removeItem(KEYS.WALLET_ID);
                window.location.replace('/');
            } else {
                const parsedResponse = await response.json();
                const errorCode = parsedResponse?.errors[0].errorCode;
                if (errorCode === 'user_logout_error') {
                    removeUser();
                    window.location.replace('/');
                }
                throw new Error(parsedResponse?.errors[0]?.errorMessage);
            }
        } catch (error) {
            console.error('Logout failed with error:', error);
            toast.error('Unable to logout. Please try again.');
        }
    };

    const dropdownItems: DropdownItem[] = [
        {
            label: t('ProfileDropdown.profile'),
            onClick: () => {
                setIsProfileDropdownOpen(false);    
                navigate('profile',{state: {from: window.location.pathname}});
            },
            textColor: 'text-gray-700',
            key: 'Profile-Dropdown-Profile'
        },
        {
            label: t('ProfileDropdown.faq'),
            onClick: () => {
                setIsProfileDropdownOpen(false);
                navigate('faq', {state: {from: window.location.pathname}});
            },
            textColor: 'text-gray-700',
            key: 'Profile-Dropdown-FAQ'
        },
        {
            label: t('ProfileDropdown.logout'),
            onClick: handleLogout,
            textColor: 'text-red-700',
            key: 'Profile-Dropdown-Logout'
        }
    ];

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const toggleHamburgerMenu = () => {
        setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
    };

    const getUserProfileIconWithName = () => (
        <div className="flex gap-2 items-center">
            <div
                className={`aspect-square w-12 sm:w-14 rounded-full bg-[#DDDDDD] overflow-hidden flex items-center justify-center text-[#1A001D] font-medium text-lg ${
                    !hasProfilePictureUrl && 'p-2 sm:p-3 md:p-4'
                }`}
            >
                {hasProfilePictureUrl ? (
                    <img
                        src={user.profilePictureUrl}
                        alt="Profile Pic"
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    getProfileInitials(displayName)
                )}
            </div>
            <span className="font-semibold text-gray-800">
                {convertStringIntoPascalCase(displayName)}
            </span>
        </div>
    );

    return (
        <header
            ref={headerRef}
            data-testid="Dashboard-Header-Container"
            className="fixed top-0 left-0 right-0 z-20 bg-iw-background bg-transparent shadow-[0_4px_5px_0_rgba(0,0,0,0.051)]"
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex justify-start items-center gap-2">
                    <div
                        data-testid="Hamburger-Menu"
                        className="block sm:hidden"
                    >
                        <img
                            data-testid="Hamburger-Menu-icon"
                            ref={hamburgerMenuRef}
                            src={HamburgerMenu}
                            alt="Hamburger Menu"
                            onClick={toggleHamburgerMenu}
                            className="cursor-pointer"
                        />
                    </div>
                    <div
                        className="w-[130px] sm:w-[160px] md:w-[170px]"
                        role={'button'}
                        tabIndex={0}
                        onMouseDown={() => navigateToDashboardHome(navigate)}
                        onKeyUp={() => navigateToDashboardHome(navigate)}
                    >
                        <img
                            src={require('../../assets/InjiWebLogo.png')}
                            className={`max-w-full h-auto object-contain cursor-pointer ${
                                isRTL(language) ? 'mr-4' : ''
                            }`}
                            data-testid="Header-InjiWeb-Logo"
                            alt="Inji Web Logo"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <LanguageSelector />

                    <div
                        data-testid="Profile-Details"
                        className="hidden sm:block relative"
                        ref={dropdownRef}
                    >
                        <div className="flex items-center space-x-2">
                            {getUserProfileIconWithName()}
                            <div
                                className="relative inline-block cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent global click handler from immediately closing the dropdown
                                    toggleProfileDropdown();
                                  }}
                            >
                                <DropdownArrowIcon
                                    isOpen={isProfileDropdownOpen}
                                />
                            </div>
                        </div>

                        {isProfileDropdownOpen && (
                            <div
                                data-testid="Profile-Dropdown"
                                className="absolute -right-7 top-100 mt-8 w-56 bg-white rounded-lg shadow-lg z-50 font-medium"
                            >
                                <div className="absolute top-[-0.3rem] right-8 w-3 h-3 bg-white transform rotate-45" />
                                <div className="py-2">
                                    {dropdownItems.map((item, index) => (
                                        <React.Fragment key={item.key}>
                                            <div
                                                className={`px-4 py-2 text-sm ${item.textColor} hover:bg-gray-100 cursor-pointer`}
                                                onClick={item.onClick}
                                            >
                                                {item.label}
                                            </div>
                                            {index !==
                                                dropdownItems.length - 1 && (
                                                <hr className="border-gray-200 my-1 mx-2" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div
                data-testid="Hamburger-Menu-dropdown"
                className="block sm:hidden w-full"
            >
                {isHamburgerMenuOpen && (
                    <div
                        style={{marginTop: headerHeight}}
                        className="absolute top-1 bg-white shadow-iw-hamburger-dropdown p-2 w-full"
                    >
                        <div>
                            <div className="flex items-center px-4 py-2">
                                {getUserProfileIconWithName()}
                            </div>
                            {dropdownItems.map((item, index) => (
                                <React.Fragment key={item.key}>
                                    <div
                                        className={`px-4 py-2 text-sm ${item.textColor} hover:bg-gray-100 cursor-pointer font-medium`}
                                        onClick={item.onClick}
                                    >
                                        {item.label}
                                    </div>
                                    {index !== dropdownItems.length - 1 && (
                                        <hr className="border-gray-200 my-1 mx-2" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
