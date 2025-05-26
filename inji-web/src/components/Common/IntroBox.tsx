import React from "react";
import {useTranslation} from "react-i18next";
import {renderGradientText} from "../../utils/builder";

export const IntroBox: React.FC = () => {
    const {t} = useTranslation("IssuersPage");
    return (
        <React.Fragment>
            <div data-testid="IntroBox-Container" className="text-center pb-10">
                <h2
                    data-testid="IntroBox-Text"
                    className="text-lg sm:text-xl lg:text-2xl font-medium text-iw-title "
                >
                    {t("Intro.title")} {renderGradientText(t("Intro.title2"))}
                </h2>
                <p
                    data-testid="IntroBox-SubText"
                    className="mt-2 sm:text-md lg:text-lg font-small text-iw-subTitle"
                >
                    {t("Intro.subTitle")}
                </p>
            </div>
        </React.Fragment>
    );
};
