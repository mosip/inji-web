import React, {useState} from "react";
import {VscGlobe} from "react-icons/vsc";
import {LanguagesSupported, switchLanguage} from "../../utils/i18n";
import {useDispatch, useSelector} from "react-redux";
import {storeLanguage} from "../../redux/reducers/commonReducer";
import {RootState} from "../../types/redux";
import {FaCheck} from "react-icons/fa6";
import {RiArrowDownSFill, RiArrowUpSFill} from "react-icons/ri";

export const LanguageSelector: React.FC = () => {
    const dispatch = useDispatch();
    let language = useSelector((state: RootState) => state.common.language);
    language = language ?? window._env_.DEFAULT_LANG;
    const [isOpen, setIsOpen] = useState(false);


    interface DropdownItem {
        label: string;
        value: string;
    }

    const handleChange = (item: DropdownItem) => {
        setIsOpen(false);
        switchLanguage(item.value);
        dispatch(storeLanguage(item.value));
    }

    return <div className={"flex flex-row justify-center items-center"} data-testid={"LanguageSelector-Outer-Div"} onBlur={()=>setIsOpen(false)}>
        <VscGlobe
            data-testid="Language-Selector-Icon"
            size={30} color={'var(--iw-color-languageGlobeIcon)'}/>
        <div className="relative inline-block ms-1">
            <button
                type="button"
                className="inline-flex items-center"
                data-testid={"Language-Selector-Button"}
                onMouseDown={() => setIsOpen(open => !isOpen)}>
                <p data-testid={`Language-Selector-Selected-DropDown-${language}`}>{LanguagesSupported.find(lang => lang.value === language)?.label}</p>
                {isOpen ? <RiArrowUpSFill size={20} color={'var(--iw-color-languageArrowIcon)'} /> : <RiArrowDownSFill size={20} color={'var(--iw-color-languageArrowIcon)'}/> }
            </button>

            {isOpen && (
                <div
                    className="absolute w-40 right-0 mt-3 rounded-md shadow-lg bg-iw-background overflow-hidden font-normal">
                    <ul className="py-1 divide-y divide-gray-200">
                        {LanguagesSupported.map((item) => (
                            <li key={item.value}
                                data-testid={`Language-Selector-DropDown-Item-${item.value}`}
                                className={language === item.value ? "text-iw-primary" : ""}>
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between flex-row"
                                    onMouseDown={(event) => {event.stopPropagation();handleChange(item)}}>
                                    {item.label}
                                    {language === item.value && <FaCheck color={'var(--iw-color-languageCheckIcon)'}/>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
}
