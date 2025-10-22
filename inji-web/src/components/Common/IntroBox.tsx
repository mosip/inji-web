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
                    className="text-[30px] leading-[38px] tracking-[-0.02em] sm:text-[36px] sm:leading-[44px] font-bold text-iw-title"
                >
                    {t("Intro.title")} <span className="italic">{renderGradientText(t("Intro.title2"))}</span>
                </h2>
                <p
                    data-testid="IntroBox-SubText"
                    className="mt-2 text-[18px] leading-[28px] font-semibold text-iw-subTitle"
                >
                    {t("Intro.subTitle")}
                </p>
            </div>
        </React.Fragment>
    );
};
