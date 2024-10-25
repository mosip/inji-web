import React, { useTransition } from "react";
import {HomeFeatureItem} from "./HomeFeatureItem";
import { useTranslation } from "react-i18next";
// TODO: ADD FeatureItem1.svg 
export const HomeFeatures:React.FC = () => {
  const {t}=useTranslation("HomePage");

  return <div className={"flex justify-center items-center flex-col"}>
    <div className={"font-semibold text-3xl m-5"}>{t("Features.heading")}</div>
    <div className={"font-extralight text-center"}>{t("Features.description1")}</div>
    <div className={"font-extralight text-center mb-10"}>{t("Features.description2")}</div>
    <img src={require("../../assets/InjiWebPreview.png")} alt={"Inji Web Preview"}/>
    <div className={"flex flex-wrap gap-8 container mx-auto pb-20 justify-center"}>
      <HomeFeatureItem itemno={1}/>
      <HomeFeatureItem itemno={2}/>
      <HomeFeatureItem itemno={3}/>
      <HomeFeatureItem itemno={4}/>
      <HomeFeatureItem itemno={5}/>
    </div>
  </div>
}
