import React, {useState} from "react";
import {HelpAccordionItem} from "./HelpAccordionItem";
import { HelpAccordionItemProps } from "../../types/components";
import {useTranslation} from "react-i18next";
import { title } from "process";
import { constructContent } from "../../utils/builder";

export const HelpAccordion: React.FC = () =>{
    
    const [open, setOpen] = useState(0);
    const {t} = useTranslation("Help");

    const accordionItems = [
        {
            title: t("item1.title"),
            content: constructContent([t("item1.description1")],false),
        },
        {
            title: t("item2.title"),
            content: constructContent([t("item2.description1")],false),
        },
        {
            title: t("item3.title"),
            content: constructContent([t("item3.description1"), t("item3.description2"), t("item3.description3")],false),
        },
        {
            title: t("item4.title"),
            content: constructContent([t("item4.description1")],false),
        },
        {
            title: t("item5.title"),
            content: constructContent([t("item5.description1")],false),
        },
        {
            title: t("item6.title"),
            content: constructContent([t("item6.description1")],false),
        },
        {
            title: t("item7.title"),
            content: constructContent([t("item7.description1"), t("item7.description2"), t("item7.description3"), t("item7.description4")],false),
        },
        {
            title: t("item8.title"),
            content:constructContent([t("item8.description1"), t("item8.description2"), t("item8.description3"), t("item8.description4"), t("item8.description5"), t("item8.description6")],false),
        },
        {
            title: t("item9.title"),
            content:constructContent([t("item9.description1"), t("item9.description2"), t("item9.description3")],false),
        },
        {
            title: t("item10.title"),
            content:constructContent([t("item10.description1")],false),
        },
        {
            title: t("item11.title"),
            content:constructContent([t("item11.description1"), t("item11.description2"), t("item11.description3"), t("item11.description4"), t("item11.description5")],false),
        },
        {
            title: t("item12.title"),
            content:constructContent([t("item12.description1"), t("item12.description2"), t("item12.description3")],false),
        },
        {
            title: t("item13.title"),
            content:constructContent([t("item13.description1"), t("item13.description2"), t("item13.description3")],false),
        },
        {
            title: t("item14.title"),
            content:constructContent([t("item14.description1"), t("item14.description2"), t("item14.description3")],false),
        },
        {
            title: t("item15.title"),
            content:constructContent([t("item15.description1"), t("item15.description2"), t("item15.description3")],false),
        },
        {
            title: t("item16.title"),
            content:constructContent([t("item16.description1"), t("item16.description2"), t("item16.description3")],false),
        },
        {
            title: t("item17.title"),
            content:constructContent([t("item17.description1"), t("item17.description2"), t("item17.description3")],false),
        },
        {
            title: t("item18.title"),
            content:constructContent([t("item18.description1"), t("item18.description2"), t("item18.description3")],false),
        },
        {
            title: t("item19.title"),
            content:constructContent([t("item19.description1"), t("item19.description2"), t("item19.description3")],false),
        },
        {
            title: t("item20.title"),
            content:constructContent([t("item20.description1")],false),
        },
        {
            title: t("item21.title"),
            content:constructContent([t("item21.description1")],true),
        },
        {
            title: t("item22.title"),
            content:constructContent([t("item22.description1")],true),
        },
        {
            title: t("item23.title"),
            content:constructContent([t("item23.description1"),t("item23.description2"),t("item23.description3"),t("item23.description4")],false),
        }
    ];

    return (
        <React.Fragment>
            <div data-testid="Help-Accordion-Container">
                {accordionItems.map((item, index) => (
                    <HelpAccordionItem
                        id={index}
                        key={index}
                        title={item.title}
                        content={item.content}
                        open={open}
                        setOpen={setOpen}
                    />))
                }
            </div>
        </React.Fragment>
    );
};
