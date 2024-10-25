import React, { useTransition } from "react";
import {FaRegCheckCircle} from "react-icons/fa";
import {GradientWrapper} from "../Common/GradientWrapper";
import { useTranslation } from "react-i18next";

export const HomeFeatureItem:React.FC = (props) => {
  const {t}=useTranslation("HomePage");

  return <div className={"bg-gray-50 p-7 max-w-96 shadow-sm"}>
      <img src={require("../../assets/FeatureItem"+props.itemno+".svg")} alt={"feature item"} />
      <div className={"font-semibold text-black text-xl text-wrap py-7"}>{t("FeatureItem"+props.itemno+".heading")}</div>
      <div className ={"flex flex-row container mx-auto py-2"}>
          <div className={"pe-3"}>
            <GradientWrapper> 
                <FaRegCheckCircle size={20} />
            </GradientWrapper>
          </div>
        <div className ={"flex flex-col"}>
          <span className={"font-medium"}>{t("FeatureItem"+props.itemno+".item1")}</span>
          <span className={"font-extralight"}>{t("FeatureItem"+props.itemno+".description1")}</span>
        </div>
      </div>
      <div className ={"flex flex-row container mx-auto mt-10"}>
          <div className={"pe-3"}>
              <GradientWrapper>
                  <FaRegCheckCircle size={20} />
              </GradientWrapper>
          </div>
          <div className ={"flex flex-col"}>
              <span className={"font-medium"}>{t("FeatureItem"+props.itemno+".item2")}</span>
              <span className={"font-extralight "}>{t("FeatureItem"+props.itemno+".description1")}</span>
          </div>
      </div>
  </div>
}
