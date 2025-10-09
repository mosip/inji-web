import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {SolidButtonStyles} from "./GoogleSignInButtonStyles.ts";

export const GoogleSignInButton:React.FC<GoogleSignInButtonProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const onClickHandler = () => {
    setIsLoading(true);
    props.handleGoogleLogin();
  };

  return (
    <button
      onClick={onClickHandler}
      disabled={isLoading}
      data-testid="google-login-button"
      className={`${SolidButtonStyles.baseStyles} ${isLoading ? SolidButtonStyles.disabledClasses : ""}`}
    >
      <FcGoogle size={24} className="flex-shrink-0" />
      {isLoading ? props.loadingText : props.text}
    </button>
  );
};

export type GoogleSignInButtonProps = {
    handleGoogleLogin: () => void;
    loadingText: string;
    text:string
  };