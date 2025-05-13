import { FcGoogle } from "react-icons/fc";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";
import '../../../index.css'; 
import { useTranslation } from "react-i18next";
import { BorderedButton } from "../../../components/Common/Buttons/BorderedButton";

export const Login: React.FC = () => {
  const { t } = useTranslation("HomePage");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  const navigate = useNavigate();

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setError(null);
        window.location.href =
            window._env_.MIMOTO_URL + "/oauth2/authorize/google";
    };


    // The below part is now being handled in PinPage only. 
    // It is redundant here. as after google login, backend will navigate to Pin Page directly.
/*
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      setIsLoading(false);
      fetchUserProfile();
    } else if (status === "error") {
      setIsLoading(false);
      setError(params.get("error_message"));
      window.location.replace("/?loginFailed=true");
    }
  }, [navigate]);

  
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(api.fetchUserProfile.url(), {
        method: "GET",
        headers: {
          ...api.fetchUserProfile.headers()
        },
        credentials: "include"
      });

      const responseData = await response.json();
      console.log("This is the response of fetchUserProfile  "+responseData.display_name+"  "+responseData.wallet_id);
      if (response.ok) {
        if (responseData.display_name) {
          localStorage.setItem(
            "displayName",
            responseData.display_name
          );
        }
        setIsProfileFetched(true);
      } else {
        setError(responseData.errorMessage);
        window.location.replace("/?loginFailed=true"); 
        throw responseData;
      }
    } catch (error) {
      console.error("Error occurred while fetching user profile:", error);
      setError("Failed to fetch user profile");
      window.location.replace("/?loginFailed=true");
    }
  };

  useEffect(() => {
    if (isProfileFetched) {
      window.location.replace("/pin");
    }
  }, [isProfileFetched, navigate]);

*/


// in case of failure in google login, redirect to login failure page
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  if (status === "error") {
    setIsLoading(false);
    setError(params.get("error_message"));
    window.location.replace("/?loginFailed=true");
  }
}, [navigate]);

  const errorStyle: React.CSSProperties = {
    color: "red",
    marginTop: "10px",
    fontSize: "14px"
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-[100%] max-w-[400px] mx-auto rounded-2xl">
      <div data-testid="login-logo" className="flex justify-center items-center">
        <img src={require("../../../assets/Logomark.png")} alt="Inji Web Logo" />
      </div>
      <div data-testid="login-title" className="text-2xl sm:text-3xl text-black font-semibold  text-center py-4">
        {t("Login.login-title")}
      </div>
      <div data-testid="login-description" className="sm:mt-3 text-sm sm:text-base font-light text-ellipsis text-center pb-0">
        {t("Login.login-description")}
      </div>
      <div data-testid="login-note" className="sm:my-3 text-sm font-light text-ellipsis text-center pb-4">
        {t("Login.login-note")}
      </div >

      <div className="w-full">
      <button 
        onClick={handleGoogleLogin} 
        disabled={isLoading} 
        data-testid="google-login-button"
        className="w-full bg-white flex items-center justify-center gap-2.5 break-words py-2 px-4 shadow-md border border-gray-300 rounded-xl"
      >
            <FcGoogle size={24} className="flex-shrink-0"/>
            {isLoading ? t("Login.logging-in") : t("Login.login-google")}
      </button>
      </div>

          {/* OR Separator */}
                     <div className="flex items-center w-full my-2 sm:my-5">
                         <hr className="flex-grow border-t border-gray-300" />
                         <span className="px-4 text-gray-500 text-sm">OR</span>
                         <hr className="flex-grow border-t border-gray-300" />
                     </div>

                     <div className="w-full">
                         <BorderedButton 
                             testId="HomeBanner-Guest-Login" 
                             onClick={() => navigate("/issuers")}
                             title={
                              t("Login.login-guest")
                            } 
                         />
                     </div>
      {error && <p style={errorStyle} data-testid="login-error">{error}</p>}
    </div>
  );
};

export default Login;
