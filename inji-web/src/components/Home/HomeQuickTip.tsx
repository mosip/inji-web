import React from "react";
import {PlainButton} from "../Common/Buttons/PlainButton";
import { useTranslation } from "react-i18next";

export const HomeQuickTip: React.FC<HomeQuickTipProps> = (props) => {
    const { t } = useTranslation("HomePage");
    return (
        <div data-testid="HomeQuickTip-Container" className="py-2 mb-5 pb-5">
          <div data-testid="HomeQuickTip-Content" className="flex flex-col sm:flex-row items-center mx-[4%] sm:mb-3 py-[5%] sm:py-[2%] px-[1%] rounded-xl bg-gradient-to-r from-iw-primary to-iw-secondary sm:w-[91%] sm:ml-auto sm:mr-auto">
            <span data-testid="HomeQuickTip-Heading" className="w-full sm:w-1/2 text-2xl text-center sm:text-left px-[2%] text-iw-text font-semibold pb-7 sm:pb-0">
              {t("QuickTip.heading")}
            </span>
            <div data-testid="HomeQuickTip-ButtonContainer" className="w-4/5 sm:w-1/6 sm:ml-auto">
              <PlainButton testId="HomeQuickTip-Get-Started" onClick={props.onClick} title={t("QuickTip.buttontext")} />
            </div>
          </div>
        </div>
    );
};

export type HomeQuickTipProps = {
    onClick: () => void
}
