import React from 'react';
import {SolidButton} from '../../components/Common/Buttons/SolidButton';
import {Trans, useTranslation} from 'react-i18next';
import InfoIcon from '../../assets/InfoIcon.svg';
import BackArrowIcon from '../../assets/BackArrowIcon.svg';
import {useUser} from '../../hooks/useUser';
import {api} from '../../utils/api';
import {useCookies} from 'react-cookie';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

export const ResetWalletPage: React.FC = () => {
    const {removeWallet, walletId} = useUser();
    const {t, i18n} = useTranslation('ResetWalletPage');
    const [cookies] = useCookies(['XSRF-TOKEN']);
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackNavigation = () => {
        navigate('/pin');
    };

    const handleForgotPasscode = async () => {
        try {
            const response = await fetch(
                api.deleteWallet.url(location.state?.walletId ?? walletId),
                {
                    method: 'DELETE',
                    headers: {
                        ...api.deleteWallet.headers(),
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                    },
                    credentials: 'include'
                }
            );
            if (!response.ok) {
                const responseData = await response.json();
                throw responseData;
            }
            removeWallet();
            navigate('/pin');
        } catch (error) {
            console.error('Error occurred while deleting Wallet:', error);
            toast.error(t('resetFailure'));
        }
    };

    return (
        <div
            className=" overflow-hidden fixed inset-0 backdrop-blur-sm bg-black bg-opacity-40 flex flex-col items-center justify-center z-50"
            data-testid="pin-page"
        >
            <div
                className="overflow-hidden rounded-2xl bg-white flex flex-col items-center justify-start relative
                   w-[85%] md:w-[75%]
                   h-[80%] sm:h-[70%] md:h-[70%] lg:h-[75%]
                   overflow-y-auto
                   overflow-x-auto
                   shadow-iw-pinPageContainer h-full"
            >
                <div className="overflow-hidden absolute inset-0 z-0 flex items-center justify-center pointer-events-none max-w-auto">
                    <div className="absolute top-[155px] -translate-x-1/2">
                        {[...Array(6)].map((_, index) => {
                            const radius = 96 + index * 96;
                            const opacity = 0.8 - index * 0.1;
                            return (
                                <div
                                    key={index}
                                    className="absolute rounded-full border overflow-hidden"
                                    style={{
                                        width: `${radius}px`,
                                        height: `${radius}px`,
                                        borderWidth: '1px',
                                        borderColor: `rgba(228, 231, 236, ${opacity})`,
                                        top: `calc(50% - ${radius / 2}px)`,
                                        left: `calc(50% - ${radius / 2}px)`
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="top-[130px] pb-4 relative flex flex-col items-center justify-center">
                    <div className="text-center items-center justify-center relative z-20 bg-transparent space-y-4 w-[90%] sm-md:w-[85%] md:w-[50%]">
                        <div
                            className="flex items-center justify-center"
                            data-testid="pin-logo"
                        >
                            <img
                                src={require('../../assets/Logomark.png')}
                                alt="Inji Web Logo"
                            />
                        </div>
                        <h1
                            className="text-xl sm:text-2xl md:text-3xl font-semibold text-iw-darkGreen p-4"
                            data-testid="pin-title"
                        >
                            {t('title')}
                        </h1>
                        <div className="flex items-start ml-4">
                            <img
                                src={BackArrowIcon}
                                alt="Back Arrow"
                                className="cursor-pointer"
                                onClick={handleBackNavigation}
                            />
                            <p
                                className="text-iw-textTertiary text-sm sm:text-base font-medium pl-6"
                                data-testid="pin-description"
                            >
                                {t('subTitle')}
                            </p>
                        </div>
                    </div>

                    <div
                        className="flex flex-col bg-white rounded-xl shadow-iw-pinPageContainer mt-8 items-center relative z-20 px-4 sm:px-6 md:px-10 py-3 sm:py-5 md:py-7 space-y-4 w-[90%] sm-md:w-[85%] md:w-[50%]"
                        data-testid="info-container"
                    >
                        <div className="bg-iw-paleGray rounded-xl bg-red flex items-start justify-center gap-2 p-4 pr-10">
                            <img src={InfoIcon} alt="Info" />
                            <div className="flex flex-col items-left gap-2 sm:gap-4 rounded-lg">
                                <p className="text-xs sm:text-sm md:text-md text-left font-montserrat font-semibold text-black">
                                    {t('popupQuestion')}
                                </p>
                                <p className="text-xs sm:text-sm md:text-md text-left font-montserrat font-normal text-black">
                                    {t('popupInfo1')}
                                </p>
                                <p className="text-xs sm:text-sm md:text-md text-left font-montserrat font-normal text-black">
                                    <Trans
                                        i18nKey={t('popupInfo2.message')}
                                        ns="ResetWalletPage"
                                        values={{
                                            highlighter1: t(
                                                'popupInfo2.highlighter1',
                                                {
                                                    ns: 'ResetWalletPage'
                                                }
                                            ),
                                            highlighter2: t(
                                                'popupInfo2.highlighter2',
                                                {
                                                    ns: 'ResetWalletPage'
                                                }
                                            )
                                        }}
                                        components={{
                                            strong: (
                                                <strong className="text-xs sm:text-sm md:text-md text-left font-montserrat text-black" />
                                            )
                                        }}
                                    />
                                </p>
                                <p className="text-xs sm:text-sm md:text-md text-left font-montserrat font-normal text-black">
                                    <Trans
                                        i18nKey={t('popupInfo3.message')}
                                        ns="ResetWalletPage"
                                        values={{
                                            highlighter: t(
                                                'popupInfo3.highlighter',
                                                {ns: 'ResetWalletPage'}
                                            )
                                        }}
                                        components={{
                                            strong: (
                                                <strong className="text-xs sm:text-sm md:text-md text-left font-montserrat text-black" />
                                            )
                                        }}
                                    />
                                </p>
                            </div>
                        </div>
                        <SolidButton
                            fullWidth={true}
                            testId="btn-forgot-passcode"
                            onClick={handleForgotPasscode}
                            title={t('forgetPasscode')}
                            className="mt-3 mb-4 sm:mt-3 sm:mb-4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetWalletPage;
