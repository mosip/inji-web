import { FcGoogle } from "react-icons/fc";
import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import '../../index.css';
import { useTranslation } from "react-i18next";
import { BorderedButton } from "../Common/Buttons/BorderedButton";
import { GoogleSignInButton } from "../Common/Buttons/GoogleSignInButton";

export const Login: React.FC = () => {
  const { t } = useTranslation("HomePage");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
      setIsLoading(true);
      window.location.href =
          window._env_.MIMOTO_URL + "/oauth2/authorize/google";
  };

  const Separator:React.FC=()=>{
    return (
      <div className="flex items-center w-full my-2 sm:my-5">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center w-[100%] max-w-[400px] mx-auto rounded-2xl">
        <div data-testid="login-logo" className="flex justify-center items-center">
          <img src={require("../../assets/Logomark.png")} alt="Inji Web Logo" />
        </div>

        <div data-testid="login-title" className="text-2xl sm:text-3xl text-black font-semibold  text-center py-4">
          {t("Login.loginTitle")}
        </div>

        <div data-testid="login-description" className="sm:mt-3 text-sm sm:text-base font-light text-ellipsis text-center pb-0">
          {t("Login.loginDescription")}
        </div>

        <div data-testid="login-note" className="sm:my-3 text-sm font-light text-ellipsis text-center pb-4">
          {t("Login.loginNote")}
        </div >

        <GoogleSignInButton handleGoogleLogin={handleGoogleLogin} loadingText={t("Login.loggingIn")} text={t("Login.loginGoogle")}/>

        <Separator/>

        <div className="w-full">
          <BorderedButton 
              testId="home-banner-guest-login" 
              onClick={() => navigate("/issuers")}
              title={
              t("Login.loginGuest")
            } 
          />
        </div>
    </div>
  );
};

export default Login;
