import {IssuerObject, IssuerWellknownObject} from "./data";
import React from "react";
import {RequestStatus} from "../hooks/useFetch";
export type HomeFeatureItemProps={
    itemno:number;
}

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
    content: (string | { __html: string })[];
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
    subContent: string;
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
export type CTContentProps = {
    expiryTime: number;
    setExpiryTime: (expiry: number) => void;
}
export type CTHeaderProps = {
    title: string;
}
export type DSContentProps = {
    credentialName: string;
    credentialLogo: string;
    setIsCustomExpiryInTimesModalOpen: (isCustomExpiryInTimesModalOpen: boolean) => void;
}
export type DSDisclaimerProps = {
    content: string;
}
export type DSFooterProps = {
    successText: string;
    onSuccess: () => void;
    cancelText: string;
    onCancel: () => void;
    parent?: string;
}
export type DSHeaderProps = {
    title: string;
    subTitle: string;
}
export type CustomExpiryModalProps = {
    onCancel: () => void;
    onSuccess: () => void;
}
export type DataShareExpiryModalProps = {
    credentialName: string;
    credentialLogo: string;
    onSuccess: () => void;
    onCancel: () => void;
}
export type ModalWrapperProps = {
    header: React.ReactNode;
    content: React.ReactNode;
    footer: React.ReactNode;
    zIndex: number;
    size: string;
}
