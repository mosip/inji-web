import React, {useEffect, useRef} from 'react';
import {Sidebar} from './Sidebar';
import {Header} from './Header';
import {Footer} from '../PageTemplate/Footer';
import {useSelector} from 'react-redux';
import {RootState} from '../../types/redux';
import {getCredentialTypeDisplayObjectForCurrentLanguage, getDirCurrentLanguage} from '../../utils/i18n';
import {Outlet} from 'react-router-dom';
import DashboardBgTop from '../../assets/Background.svg';
import DashboardBgBottom from '../../assets/DashboardBgBottom.svg';
import 'react-toastify/dist/ReactToastify.css';
import {CrossIconButton} from '../Common/Buttons/CrossIconButton';
import LayoutStyles from "../Common/LayoutStyles";
import {useDownloadSessionDetails} from '../../hooks/User/useDownloadSession';
import {useTranslation} from "react-i18next";
import {showToast} from "../Common/toast/ToastWrapper";
import {CloseButtonProps} from "react-toastify/dist/components";
import {RequestStatus} from "../../utils/constants";

export const Layout: React.FC = () => {
    const {t} = useTranslation('Layout')
    const language = useSelector((state: RootState) => state.common.language);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = React.useState(0);
    const [footerHeight, setFooterHeight] = React.useState(0);
    const {
        latestDownloadedSessionId,
        downloadInProgressSessions,
        setLatestDownloadedSessionId,
        currentSessionDownloadId,
        removeSession
    } = useDownloadSessionDetails();

    useEffect(() => {
        const updateHeights = () => {
            const headerHeight =
                headerRef.current?.getBoundingClientRect().height ?? 0;
            const footerHeight =
                footerRef.current?.getBoundingClientRect().height ?? 0;
            setHeaderHeight(headerHeight);
            setFooterHeight(footerHeight);
        };

        updateHeights();
        window.addEventListener('resize', updateHeights);
        return () => window.removeEventListener('resize', updateHeights);
    }, []);

    useEffect(() => {
            if (latestDownloadedSessionId && !currentSessionDownloadId) {
                const session = downloadInProgressSessions[latestDownloadedSessionId];
                if (session) {
                    const credentialTypeDisplayName =
                        getCredentialTypeDisplayObjectForCurrentLanguage(
                            session.credentialTypeDisplayObj,
                            language
                        ).name;
                    const {downloadStatus} = session;

                    const toastOptions = {
                        limit: 1,
                        autoClose: 3000,
                        icon: undefined,
                        closeButton: handleToasterCloseButton,
                        style: {
                            marginTop: headerHeight + 5,
                        },
                        className: ({type}: any) => {
                            const toastType = type ?? 'default';
                            return `${getToasterBackgroundColor(toastType)} ${LayoutStyles.toastContainerBase}`;
                        }
                    };
                    const toastMessage = downloadStatus === RequestStatus.DONE
                        ? t('VCDownload.success', {cardType: credentialTypeDisplayName})
                        : t('VCDownload.error', {cardType: credentialTypeDisplayName})

                    showToast({
                            message: toastMessage,
                            type: downloadStatus === RequestStatus.DONE ? 'success' : 'error',
                            options: {...toastOptions}
                        }
                    );
                    setLatestDownloadedSessionId(null);
                    removeSession(latestDownloadedSessionId);
                }
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [latestDownloadedSessionId, downloadInProgressSessions, setLatestDownloadedSessionId, removeSession]
    )
    ;

    const contextClassMap = {
        success: LayoutStyles.successToastContainer,
        error: LayoutStyles.errorToastContainer,
        default: ''
    };

    const getToasterBackgroundColor = (type: string) => {
        return contextClassMap[type as keyof typeof contextClassMap];
    };

    const handleToasterCloseButton = ({closeToast}: CloseButtonProps) => (
        <CrossIconButton
            onClick={(e) => {
                e.stopPropagation();
                closeToast(e);
            }}
            iconClassName={LayoutStyles.closeIcon}
        />
    );

    return (
        <div
            className="h-screen flex flex-col bg-iw-background font-base overflow-hidden w-full relative"
            dir={getDirCurrentLanguage(language)}
        >
            <Header headerRef={headerRef} headerHeight={headerHeight}/>

            <div
                className="flex flex-1 overflow-hidden w-full relative"
                style={{
                    marginTop: headerHeight,
                    marginBottom: footerHeight,
                    zIndex: 0
                }}
            >
                <Sidebar/>
                <div
                    className={
                        'relative flex flex-col overflow-hidden w-full transition-all duration-300'
                    }
                    style={{zIndex: 1}}
                >
                    <img
                        src={DashboardBgTop}
                        alt="Gradient Top Background"
                        className="absolute top-0 left-0 w-full z-[-1]"
                    />

                    <img
                        src={DashboardBgBottom}
                        alt="Gardient Bottom Background"
                        className="absolute bottom-0 left-0 w-full z-[-1]"
                    />

                    <div className="flex flex-grow flex-col overflow-y-auto relative z-10 p-4">
                        <Outlet />
                    </div>

                </div>
            </div>

            <Footer footerRef={footerRef}/>
        </div>
    );
};