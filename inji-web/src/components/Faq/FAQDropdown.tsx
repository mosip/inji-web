import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import DropdownArrowIcon from '../Common/DropdownArrowIcon';
import {ROUTES} from "../../utils/constants";

// TODO This component is not being used in the current codebase, but it is kept for future use. We have to check if this can be generalized and used in other places as well.
export const FAQDropdown: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const {t} = useTranslation('FAQDropdown');

    return (
        <div
            className={'flex flex-row justify-center items-center'}
            data-testid={'faq-dropdown-outer-div'}
            onBlur={() => setIsOpen(false)}
            tabIndex={0}
            role="button"
        >
            <div className="relative inline-block ms-1">
                <button
                    type="button"
                    className="inline-flex items-center"
                    data-testid={'faq-dropdown-button'}
                    onMouseDown={() => setIsOpen((open) => !isOpen)}
                >
                    <p data-testid={`selected-dropDown`}>{t('heading')}</p>
                    <DropdownArrowIcon isOpen={isOpen} />
                </button>

                {isOpen && (
                    <div className="absolute w-40 right-0 mt-3 rounded-md shadow-lg bg-iw-background overflow-hidden font-normal">
                        <ul className="py-1 divide-y divide-gray-200">
                            <li data-testid={`faq-dropdown-item`}>
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 text-left text-sm font-semibold hover:bg-gray-100 flex items-center justify-between flex-row"
                                    onMouseDown={() => {
                                        setIsOpen((open) => !open);
                                        navigate(ROUTES.FAQ);
                                    }}
                                >
                                    {t('item1')}
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
