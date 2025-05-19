import React, {useEffect, useRef, useState} from 'react';
import {Sidebar} from './Sidebar';
import {Header} from './Header';
import {Footer} from '../PageTemplate/Footer';
import {useSelector} from 'react-redux';
import {RootState} from '../../types/redux';
import {getDirCurrentLanguage} from '../../utils/i18n';
import {Outlet} from 'react-router-dom';
import DashboardBgTop from '../../assets/Background.svg';
import DashboardBgBottom from '../../assets/DashboardBgBottom.svg';

export const Layout: React.FC = () => {
    const language = useSelector((state: RootState) => state.common.language);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.getBoundingClientRect().height);
        }
        if (footerRef.current) {
            setFooterHeight(footerRef.current.getBoundingClientRect().height);
        }
    }, []);

    return (
        <div
            className="h-screen flex flex-col bg-iw-background font-base overflow-hidden w-full relative"
            dir={getDirCurrentLanguage(language)}
        >
            <Header ref={headerRef} headerHeight={headerHeight} />

            <div
                className="flex flex-1 overflow-hidden w-full relative"
                style={{
                    marginTop: headerHeight,
                    marginBottom: footerHeight,
                    zIndex: 0
                }}
            >
                <Sidebar />
                <div
                    className={'relative flex flex-col overflow-hidden w-full transition-all duration-300'}
                    style={{zIndex: 1}}
                >
                    <img
                        src={DashboardBgTop}
                        alt="Dashboard Top Bg Image"
                        className="absolute top-0 left-0 w-full z-[-1]"
                    />

                    <img
                        src={DashboardBgBottom}
                        alt="Dashboard Bottom Bg Image"
                        className="absolute bottom-0 left-0 w-full z-[-1]"
                    />

                    <div className="flex-1 overflow-y-auto relative z-10 p-4">
                        <Outlet />
                    </div>
                </div>
            </div>

            <Footer ref={footerRef} />
        </div>
    );
};
