import React, {useState} from "react";
import {FAQAccordionItem} from "./FAQAccordionItem";
import {useTranslation} from "react-i18next";
import { constructContent } from "../../utils/builder";
import {FAQAccordionItemType} from '../../types/data';

export const FAQAccordion: React.FC = () =>{
    
    const [open, setOpen] = useState(0);
    const {t} = useTranslation("FAQ");

    const accordionItems: FAQAccordionItemType[] = [
        {
            key: 'item1',
            title: t('item1.title'),
            content: constructContent([t('item1.description1')], false)
        },
        {
            key: 'item2',
            title: t('item2.title'),
            content: constructContent([t('item2.description1')], false)
        },
        {
            key: 'item3',
            title: t('item3.title'),
            content: constructContent(
                [
                    t('item3.description1'),
                    t('item3.description2'),
                    t('item3.description3')
                ],
                false
            )
        },
        {
            key: 'item4',
            title: t('item4.title'),
            content: constructContent([t('item4.description1')], false)
        },
        {
            key: 'item5',
            title: t('item5.title'),
            content: constructContent([t('item5.description1')], false)
        },
        {
            key: 'item6',
            title: t('item6.title'),
            content: constructContent([t('item6.description1')], false)
        },
        {
            key: 'item7',
            title: t('item7.title'),
            content: constructContent(
                [
                    t('item7.description1'),
                    t('item7.description2'),
                    t('item7.description3'),
                    t('item7.description4')
                ],
                false
            )
        },
        {
            key: 'item8',
            title: t('item8.title'),
            content: constructContent(
                [
                    t('item8.description1'),
                    t('item8.description2'),
                    t('item8.description3'),
                    t('item8.description4'),
                    t('item8.description5')
                ],
                false
            )
        },
        {
            key: 'item9',
            title: t('item9.title'),
            content: constructContent([t('item9.description1')], false)
        },
        {
            key: 'item10',
            title: t('item10.title'),
            content: constructContent([t('item10.description1')], false)
        },
        {
            key: 'item11',
            title: t('item11.title'),
            content: constructContent(
                [
                    t('item11.description1'),
                    t('item11.description2'),
                    t('item11.description3'),
                    t('item11.description4')
                ],
                false
            )
        },
        {
            key: 'item12',
            title: t('item12.title'),
            content: constructContent([t('item12.description1')], false)
        },
        {
            key: 'item13',
            title: t('item13.title'),
            content: constructContent(
                [t('item13.description1'), t('item13.description2')],
                false
            )
        },
        {
            key: 'item14',
            title: t('item14.title'),
            content: constructContent([t('item14.description1')], false)
        },
        {
            key: 'item15',
            title: t('item15.title'),
            content: constructContent([t('item15.description1')], false)
        },
        {
            key: 'item16',
            title: t('item16.title'),
            content: constructContent([t('item16.description1')], false)
        },
        {
            key: 'item17',
            title: t('item17.title'),
            content: constructContent([t('item17.description1')], false)
        },
        {
            key: 'item18',
            title: t('item18.title'),
            content: constructContent(
                [
                    t('item18.description1'),
                    t('item18.description2'),
                    t('item18.description3')
                ],
                false
            )
        },
        {
            key: 'item19',
            title: t('item19.title'),
            content: constructContent([t('item19.description1')], false)
        },
        {
            key: 'item20',
            title: t('item20.title'),
            content: constructContent([t('item20.description1')], false)
        },
        {
            key: 'item21',
            title: t('item21.title'),
            content: constructContent([t('item21.description1')], true)
        },
        {
            key: 'item22',
            title: t('item22.title'),
            content: constructContent([t('item22.description1')], true)
        },
        {
            key: 'item23',
            title: t('item23.title'),
            content: constructContent(
                [
                    t('item23.description1'),
                    t('item23.description2'),
                    t('item23.description3')
                ],
                false
            )
        }
    ];

    return (
        <React.Fragment>
            <div data-testid="Faq-Accordion-Container">
                {accordionItems.map((item, index) => (
                    <FAQAccordionItem
                        id={index}
                        key={item.key}
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
