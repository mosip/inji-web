import {IssuerObject, IssuerWellknownObject} from "./data";
import React from "react";
import {RequestStatus} from "../hooks/useFetch";

export type ItemBoxProps = {
    index: number;
    url: string;
    title: string;
    description?: string;
    onClick: () => void;
}
export type NavBarProps = {
    title: string;
    link: string;
    search: boolean;
    fetchRequest?: any;
}
export type CredentialProps = {
    credentialId: string;
    credentialWellknown: IssuerWellknownObject;
    index: number;
}
export type HelpAccordionItemProps = {
    id: number;
    title: string;
    content: string[];
    open: number;
    setOpen: React.Dispatch<React.SetStateAction<number>>;
}
export type IssuerProps = {
    index: number;
    issuer: IssuerObject;
}
export type DownloadResultProps = {
    state: RequestStatus;
    title: string;
    subTitle: string;
}

export type EmptyListContainerProps = {
    content: string;
}

export type HeaderTileProps = {
    content: string;
}
export type SearchIssuerProps = {
    state: RequestStatus;
    fetchRequest: any
}
export type IssuersListProps = {
    state: RequestStatus;
}
export type CredentialListProps = {
    state: RequestStatus;
}
