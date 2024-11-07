import React from "react";
import {FaRegCheckCircle} from "react-icons/fa";
import {GradientWrapper} from "../Common/GradientWrapper";
import { useTranslation } from "react-i18next";
import { HomeFeatureItemProps } from "../../types/components";

export const HomeFeatureItem: React.FC<HomeFeatureItemProps> = (props) => {
  const {t} = useTranslation("HomePage");

  return (
    <div data-testid={"HomeFeatureItem" + props.itemno + "-Container"} className="bg-gray-50 p-7 max-w-96 shadow-sm">
      <img data-testid={"HomeFeatureItem" + props.itemno + "-Image"} src={require("../../assets/FeatureItem" + props.itemno + ".svg")} alt="feature item" />
      <div data-testid={"HomeFeatureItem" + props.itemno + "-Heading"} className="font-semibold text-black text-xl text-wrap py-7">
        {t("FeatureItem" + props.itemno + ".heading")}
      </div>
      <div data-testid={"HomeFeatureItem" + props.itemno + "-FirstFeature"} className="flex flex-row container mx-auto py-2">
        <div className="pe-3">
          <GradientWrapper>
            <FaRegCheckCircle size={20} />
          </GradientWrapper>
        </div>
        <div className="flex flex-col">
          <span data-testid={"HomeFeatureItem" + props.itemno + "-FirstFeature-Item"} className="font-medium">
            {t("FeatureItem" + props.itemno + ".item1")}
          </span>
          <span data-testid={"HomeFeatureItem" + props.itemno + "-FirstFeature-Description"} className="font-extralight">
            {t("FeatureItem" + props.itemno + ".description1")}
          </span>
        </div>
      </div>
      <div data-testid={"HomeFeatureItem" + props.itemno + "-SecondFeature"} className="flex flex-row container mx-auto mt-10">
        <div className="pe-3">
          <GradientWrapper>
            <FaRegCheckCircle size={20} />
          </GradientWrapper>
        </div>
        <div className="flex flex-col">
          <span data-testid={"HomeFeatureItem" + props.itemno + "-SecondFeature-Item"} className="font-medium">
            {t("FeatureItem" + props.itemno + ".item2")}
          </span>
          <span data-testid={"HomeFeatureItem" + props.itemno + "-SecondFeature-Description"} className="font-extralight">
            {t("FeatureItem" + props.itemno + ".description2")}
          </span>
        </div>
      </div>
    </div>
  );
}
