import React from "react";
import { HelpAccordionItemProps } from "../../types/components";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {renderContent} from "../../utils/builder";

export const HelpAccordionItem: React.FC<HelpAccordionItemProps> = (props) => {
    return (
        <React.Fragment>
            <div className="rounded-md mb-2 shadow-md shadow-iw-shadow"
                 data-testid="Help-Item-Container">
                <button
                    data-testid="Help-Item-Title-Button"
                    className="w-full p-5 text-left font-bold hover:bg-iw-helpAccordionHover focus:outline-none"
                    onClick={() => props.setOpen(props.id === props.open ? -1 : props.id)}
                >
                    <div className={"flex flex-row text-iw-title"}
                         data-testid="Help-Item-Title-Text">
                        {props.title}
                        <div className={"flex items-center ms-auto"}>
                            {
                                (props.id === props.open) ? <IoIosArrowUp size={20} data-testid="Help-Item-UpArrow"/> :
                                    <IoIosArrowDown size={20} data-testid="Help-Item-DownArrow"/>
                            }
                        </div>
                    </div>
                </button>
                {(props.id === props.open) && (
                    <div className="p-5 bg-iw-background border-t"
                         data-testid="Help-Item-Content-Text">
                        {props.content.map((content, index) => (
                            <p key={index} className={"text-iw-title"}>
                                {renderContent(content)}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

