import React from "react";
import {FaRegCheckCircle} from "react-icons/fa";
import {GradientWrapper} from "../Common/GradientWrapper";

export const HomeFeatureItem:React.FC = () => {
  return <div className={"bg-gray-50 p-7 max-w-96 shadow-sm"}>
      <img src={require("../../assets/FeaturedItem.png")} alt={"feature item"} />
      <div className={"font-semibold text-black text-xl text-wrap py-7"}>Access Your Credentials, Anywhere You Need</div>
      <div className ={"flex flex-row container mx-auto py-2"}>
          <div className={"pe-3"}>
            <GradientWrapper>
                <FaRegCheckCircle size={20} />
            </GradientWrapper>
          </div>
        <div className ={"flex flex-col"}>
          <span className={"font-medium"}>Credentials, Simplified</span>
          <span className={"font-extralight"}>Keep all your essential documents at your fingertips.</span>
        </div>
      </div>
      <div className ={"flex flex-row container mx-auto mt-10"}>
          <div className={"pe-3"}>
              <GradientWrapper>
                  <FaRegCheckCircle size={20} />
              </GradientWrapper>
          </div>
          <div className ={"flex flex-col"}>
              <span className={"font-medium"}>Credentials, Simplified</span>
              <span className={"font-extralight "}>Keep all your essential documents at your fingertips.</span>
          </div>
      </div>
  </div>
}
