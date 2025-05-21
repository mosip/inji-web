import React, {forwardRef, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {LanguageSelector} from '../Common/LanguageSelector';
import {GiHamburgerMenu} from 'react-icons/gi';
import OutsideClickHandler from 'react-outside-click-handler';
import {RootState} from '../../types/redux';
import {useSelector} from 'react-redux';
import {isRTL} from '../../utils/i18n';
import {api} from '../../utils/api';
import {useCookies} from 'react-cookie';
import {useUser} from '../../hooks/useUser';
import { PlainButton } from '../Common/Buttons/PlainButton';

export const Header = forwardRef<HTMLDivElement, any>((props, ref) => {
    const language = useSelector((state: RootState) => state.common.language);
    const {t, i18n} = useTranslation('PageTemplate');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const {user, removeUser} = useUser();

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!user?.displayName);
        };

        window.addEventListener('displayNameUpdated', handleStorageChange);

        return () => {
            window.removeEventListener(
                'displayNameUpdated',
                handleStorageChange
            );
        };
    }, []);

    const handleAuthAction = async () => {
        if (isLoggedIn) {
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
                    localStorage.removeItem('walletId');
                    window.location.replace('/');
                } else {
                    const parsedResponse = await response.json();
                    const errorCode = parsedResponse?.errors[0].errorCode;
                    if (errorCode === 'user_logout_error') {
                        removeUser();
                        window.location.replace('/login');
                    }
                    throw new Error(parsedResponse?.errors[0]?.errorMessage);
                }
            } catch (error) {
                console.error('Logout failed with error:', error);
            }
        } else {
            navigate('/login');
        }
    };

    return (
        <header
            ref={ref}
            className="fixed top-0 left-0 right-0 bg-iw-background py-7 z-10 shadow-[0_4px_5px_0_rgba(0,0,0,0.051)]"
        >
            <div
                data-testid="Header-Container"
                className="container mx-auto flex justify-between items-center px-4"
            >
                <div
                    data-testid="Header-InjiWeb-Logo-Container"
                    className={`flex flex-row ${
                        isRTL(language) ? 'space-x-reverse' : 'space-x-9'
                    } justify-center items-center`}
                >
                    <div
                        role="button"
                        tabIndex={0}
                        className={`m-3 sm:hidden ${
                            isRTL(language) ? 'ml-4' : ''
                        }`}
                        onMouseDown={() => setIsOpen((open) => !open)}
                        onKeyUp={() => setIsOpen((open) => !open)}
                    >
                        <GiHamburgerMenu size={32} />
                    </div>
                    <div
                        role={'button'}
                        tabIndex={0}
                        onMouseDown={() => navigate('/')}
                        onKeyUp={() => navigate('/')}
                    >
                        <img
                            src={require('../../assets/InjiWebLogo.png')}
                            className={`h-6 w-36 flex-shrink-0 sm:h-8 sm:w-48 cursor-pointer 
                                     ${isRTL(language) ? 'mr-4' : ''}`}
                            data-testid="Header-InjiWeb-Logo"
                            alt="Inji Web Logo"
                        />
                    </div>
                </div>

                {/* ---------------------------Credentials page saved for future use -----------------------*/}
                {/* {isLoggedIn && (
                    <li data-testid="Header-Menu-View-Credentials">
                        <div
                            data-testid="Header-Menu-View-Credentials-div"
                            onMouseDown={() =>
                                navigate('/view/wallet/credentials')
                            }
                            onKeyUp={() => navigate('/view/wallet/credentials')}
                            role="button"
                            tabIndex={0}
                            className="text-iw-title cursor-pointer hidden sm:inline-block"
                        >
                            {'Credentials'}
                        </div>
                    </li>
                )} */}
                <div
                    className="flex flex-row space-x-4"
                    data-testid="Header-FAQ-LanguageSelector-Container"
                >
                    <PlainButton
                        fullWidth={true}
                        onClick={() => navigate('/help')}
                        testId="Header-Menu-FAQ"
                        title={t('Header.faq')}
                        disableGradient={true}
                    />
                    <LanguageSelector data-testid="Header-Menu-LanguageSelector" />
                </div>
            </div>
            {isOpen && (
                <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
                    <div
                        className="container sm:hidden mx-auto px-4 flex flex-col justify-start items-start font-semibold"
                        role="button"
                        tabIndex={0}
                        onMouseDown={() => setIsOpen(false)}
                        onBlur={() => setIsOpen(false)}
                    >
                        <div
                            data-testid="Header-Menu-Faq"
                            role="button"
                            tabIndex={0}
                            onKeyUp={() => {
                                navigate('/faq');
                                setIsOpen(false);
                            }}
                            onMouseDown={() => {
                                navigate('/faq');
                                setIsOpen(false);
                            }}
                            className="text-iw-title cursor-pointer py-5 w-full inline-block"
                        >
                            {t('Header.faq')}
                        </div>
                    </div>
                </OutsideClickHandler>
            )}
        </header>
    );
});

Header.displayName = 'Header';
