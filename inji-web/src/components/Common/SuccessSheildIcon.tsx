import {BsShieldFillCheck} from "react-icons/bs";
import React from "react";

export const SuccessSheildIcon: React.FC = () => {
    return <div className="rounded-full p-2 shadow">
        <div className="rounded-full p-8 bg-iw-shieldSuccessShadow ">
            <BsShieldFillCheck
                data-testid="DownloadResult-Success-ShieldIcon" size={40} color={'var(--iw-color-shieldSuccessIcon)'}/>
        </div>
    </div>
}
