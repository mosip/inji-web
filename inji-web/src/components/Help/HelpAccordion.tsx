import React, {useState} from "react";
import {HelpAccordionItem} from "./HelpAccordionItem";
import {useTranslation} from "react-i18next";

export const HelpAccordion: React.FC = () => {

    const [open, setOpen] = useState(0);
    const {t} = useTranslation("Help");
    const accordionItems = [
        {
            title: t("item1.title"),
            content: [t("item1.description1")],
        },
        {
            title: t("item2.title"),
            content: [t("item2.description1")],
        },
        {
            title: t("item3.title"),
            content: [t("item3.description1"), t("item3.description2"), t("item3.description3")],
        },
        {
            title: t("item4.title"),
            content: [t("item4.description1")],
        },
        {
            title: t("item5.title"),
            content: [t("item5.description1")],
        },
        {
            title: t("item6.title"),
            content: [t("item6.description1")],
        },
        {
            title: t("item7.title"),
            content: [t("item7.description1"), t("item7.description2"), t("item7.description3"), t("item7.description4")],
        },
    ];
    return (
        <React.Fragment>
            <div data-testid="Help-Accordion-Container">
                {accordionItems.map((item, index) => (
                    <HelpAccordionItem id={index}
                                       key={index}
                                       title={item.title}
                                       content={item.content}
                                       open={open}
                                       setOpen={setOpen}
                    />
                ))}
            </div>
        </React.Fragment>
    );
};
