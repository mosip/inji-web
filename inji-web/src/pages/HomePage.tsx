import React, {CSSProperties, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {HomeBanner} from "../components/Home/HomeBanner";
import {HomeFeatures} from "../components/Home/HomeFeatures";
import {HomeQuickTip} from "../components/Home/HomeQuickTip";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import { useLocation } from 'react-router-dom';
import {LoginFailedModal} from '../pages/users/login/LoginFailedModal'

export const HomePage: React.FC = () => {
    const {t} = useTranslation("HomePage");
    const [toastVisible, setToastVisible] = useState(false);
    const location = useLocation();
    const [isModalVisible, setModalVisible] = useState(false);

    // Not Displaying Name after login for now
    // const [displayName, setDisplayName] = useState<string | null>(null);

    // useEffect(() => {
    //     setDisplayName(localStorage.getItem("displayName"));
    // }, [localStorage.getItem("displayName")]);


    // to stop scrolling the blurred background when login failed modal is showing up, scrolling is locked.
    useEffect(() => {
        if (isModalVisible) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        // Cleaning up the class when the component unmounts
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isModalVisible]);

    // If google login is failing,show login failed modal 
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('loginFailed') === 'true') {
          setModalVisible(true);
        }
      }, [location]);

    const showToast = (message: string) => {
        if (toastVisible) return;
        setToastVisible(true);
        toast.warning(message, {
            onClose: () => setToastVisible(false),
            toastId: "toast-wrapper"
        });
    };
  
    return (
        <div>
        <div className={"pb-20 flex flex-col gap-y-4 "}>
        {/* {displayName && <div className="greeting">Hi {displayName}</div>} */}
            <HomeBanner />
            <HomeFeatures />
            <HomeQuickTip onClick={() => showToast(t("QuickTip.toastText"))} />
        </div>

        {isModalVisible && <LoginFailedModal/>}
    </div>
    
    );
};
