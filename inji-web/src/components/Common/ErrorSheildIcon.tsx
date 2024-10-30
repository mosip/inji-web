import {BsShieldFillX} from "react-icons/bs";
import React from "react";

export const ErrorSheildIcon: React.FC = () => {
  return <div className="rounded-full p-2 shadow">
      <div className="rounded-full p-8 bg-iw-shieldErrorShadow">
          <BsShieldFillX
              data-testid="DownloadResult-Error-ShieldIcon" size={40} color={'var(--iw-color-shieldErrorIcon)'}/>
      </div>
  </div>
}
