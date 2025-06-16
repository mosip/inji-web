import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {IssuersPage} from '../../IssuersPage';
import {useUser} from '../../../hooks/User/useUser';
import {convertStringIntoPascalCase} from "../../../utils/misc";
import {HomePageStyles} from "./HomePageStyles";

export const HomePage: React.FC = () => {
    const {t} = useTranslation('User');
    const [displayName, setDisplayName] = useState<string | undefined>(undefined);
    const {user} = useUser();
    const userDisplayName = user?.displayName;

    useEffect(() => {
        setDisplayName(userDisplayName);
    }, [userDisplayName]);

    return (
        <div className={HomePageStyles.container}>
            <h1 className={HomePageStyles.welcomeText}>
                {`${t('Home.welcome')} ${convertStringIntoPascalCase(
                    displayName
                )}!`}
            </h1>
            <IssuersPage />
        </div>
    );
};
