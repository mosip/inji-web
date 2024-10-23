import React from "react";
import {HomeFeatureItem} from "./HomeFeatureItem";

export const HomeFeatures:React.FC = () => {
  return <div className={"flex justify-center items-center flex-col"}>
    <div className={"font-semibold text-3xl m-5"}>Features of Inji Web</div>
    <div className={"font-extralight text-center"}>Seamless and secure management of verifiable credentials</div>
    <div className={"font-extralight text-center mb-10"}>for trusted digital interactions.</div>
    <img src={require("../../assets/InjiWebPreview.png")} alt={"Inji Web Preview"}/>
    <div className={"flex flex-wrap gap-8 container mx-auto pb-20 justify-center"}>
      <HomeFeatureItem />
      <HomeFeatureItem />
      <HomeFeatureItem />
      <HomeFeatureItem />
      <HomeFeatureItem />
    </div>
  </div>
}
