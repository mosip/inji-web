import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

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
      className="w-full bg-white flex items-center justify-center gap-2.5 break-words py-2 px-4 shadow-md border border-gray-300 rounded-xl"
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