import { FcGoogle } from "react-icons/fc";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../../../index.css'; 
import { useTranslation } from "react-i18next";
import { BorderedButton } from "../../../components/Common/Buttons/BorderedButton";

export const Login: React.FC = () => {
  const { t } = useTranslation("HomePage");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
      setIsLoading(true);
      setError(null);
      window.location.href =
          window._env_.MIMOTO_URL + "/oauth2/authorize/google";
  };

  const errorStyle: React.CSSProperties = {
    color: "red",
    marginTop: "10px",
    fontSize: "14px"
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
        <img src={require("../../../assets/Logomark.png")} alt="Inji Web Logo" />
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

      <div className="w-full">
      <button 
        onClick={handleGoogleLogin} 
        disabled={isLoading} 
        data-testid="google-login-button"
        className="w-full bg-white flex items-center justify-center gap-2.5 break-words py-2 px-4 shadow-md border border-gray-300 rounded-xl"
      >
            <FcGoogle size={24} className="flex-shrink-0"/>
            {isLoading ? t("Login.loggingIn") : t("Login.loginGoogle")}
      </button>
      </div>  

        <Separator/>

      <div className="w-full">
          <BorderedButton 
              testId="HomeBanner-Guest-Login" 
              onClick={() => navigate("/issuers")}
              title={
              t("Login.loginGuest")
            } 
          />
      </div>
      {error && <p style={errorStyle} data-testid="login-error">{error}</p>}
    </div>
  );
};

export default Login;
