import React from "react"; // adjust path as needed
import { renderGradientTextNormal } from "../../../utils/builder";

interface PlainButtonProps {
  title: string;
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
  disableGradient?: boolean;
  testId?: string;
}

export const PlainButtonNormal: React.FC<PlainButtonProps> = (props) => {
  return (
    <div className={props.fullWidth ? "w-full" : ""}>
      <div
        className={`rounded-lg text-center cursor-pointer ${props.className || ""}`}
        onClick={props.onClick}
      >
        <div className="py-2 px-4 rounded-lg bg-white">
          <button
            data-testid={props.testId}
            className="rounded-lg" 
          >
              {props.disableGradient ? props.title : renderGradientTextNormal(props.title)}
          </button>
        </div>
      </div>
    </div>
  );
};
