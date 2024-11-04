import React, {useState, useTransition} from "react";
import {FaCheck} from "react-icons/fa6";
import {RiArrowDownSFill, RiArrowUpSFill} from "react-icons/ri";
import {GradientWrapper} from "./GradientWrapper";
import {useNavigate} from "react-router-dom";
import {renderGradientText} from "../../utils/builder";
import { useTranslation } from "react-i18next";

export const HelpDropdown: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const {t}=useTranslation("HelpDropdown");

    return <div className={"flex flex-row justify-center items-center"}
                data-testid={"HelpDropdown-Outer-Div"}
                onBlur={()=>setIsOpen(false)}
                tabIndex={0}
                role="button">

        <div className="relative inline-block ms-1">
            <button
                type="button"
                className="inline-flex items-center"
                data-testid={"HelpDropdown-Button"}
                onMouseDown={() => setIsOpen(open => !isOpen)}>
                    <p data-testid={`Selected-DropDown`}>
                        {t("heading")}
                </p>
                {isOpen ?
                    <GradientWrapper>
                        <RiArrowUpSFill size={20} color={'var(--iw-color-languageArrowIcon)'} />
                    </GradientWrapper> :
                    <GradientWrapper>
                        <RiArrowDownSFill size={20} color={'var(--iw-color-languageArrowIcon)'}/>
                    </GradientWrapper> }
            </button>

            {isOpen && (
                <div
                    className="absolute w-40 right-0 mt-3 rounded-md shadow-lg bg-iw-background overflow-hidden font-normal">
                    <ul className="py-1 divide-y divide-gray-200">
                        <li data-testid={`Help-DropDown-Item`}>
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-left text-sm font-semibold hover:bg-gray-100 flex items-center justify-between flex-row"
                                onMouseDown={() => {setIsOpen(open=>!open); navigate("/help");}}>{t("item1")}
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    </div>
}
