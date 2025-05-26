import { FaExclamationCircle } from "react-icons/fa";
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { api, MethodType } from "../../utils/api";
import { useCookies } from "react-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SolidButton } from "../../components/Common/Buttons/SolidButton";
import { useTranslation } from "react-i18next";
import {useFetch} from "../../hooks/useFetch";

export const PinPage: React.FC = () => {
  const {state, fetchRequest} = useFetch();
  const { t, i18n } = useTranslation("PinPage");
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [cookies] = useCookies(["XSRF-TOKEN"]);
  
  const [passcode, setPasscode] = useState<string[]>(Array(6).fill(""));
  const [showPasscode, setShowPasscode] = useState(false);

  const [confirmPasscode, setConfirmPasscode] = useState<string[]>(Array(6).fill(""));
  const [showConfirm, setShowConfirm] = useState(false);

  const [isPinCorrect, setIsPinCorrect] = useState<boolean | null>(null);

  const passcodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPasscodeRefs = useRef<(HTMLInputElement | null)[]>([]);

// Taking input for passcodes from user
  const handleInputChange = (
    index: number,
    value: string,
    type: "passcode" | "confirm"
  ) => {
    if (!/\d/.test(value) && value !== "") return;

    const refs = type === "passcode" ? passcodeRefs : confirmPasscodeRefs;
    const values = type === "passcode" ? [...passcode] : [...confirmPasscode];
    values[index] = value;

    if (type === "passcode") {
      setPasscode(values);
    } else {
      setConfirmPasscode(values);
    }

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    } 
  };

// Styling & Functionoing of Inputs
  const renderInputs = (
    type: "passcode" | "confirm",
    visible: boolean,
    toggleVisibility: () => void
  ) => {
    const values = type === "passcode" ? passcode : confirmPasscode;
    const refs = type === "passcode" ? passcodeRefs : confirmPasscodeRefs;
    
    return (
      <div className="flex items-center gap-2">
        {values.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (refs.current[idx] = el)}
            type={visible ? "text" : "password"}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(idx, e.target.value, type)}
            onFocus={(e) => e.target.classList.add('border-black')}
          onBlur={(e) => {
            if (!digit) {
              e.target.classList.remove('border-black');
              e.target.classList.add('border-gray-300');
            }
          }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && idx > 0 && !digit) {
                refs.current[idx - 1]?.focus();
              }
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 text-center border mb-4  ${
                digit ? 'border-black' : 'border-gray-300'
              } rounded-lg text-lg sm:text-xl focus:outline-none`}
          />
        ))}
        <button type="button" onClick={toggleVisibility} className=" px-3 pb-4 sm:px-5">
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    );
  };

  useEffect(() => {  
    const fetchWallets = async () => {
      try {

        // Fetch list of wallets present
        let responseData = await fetchRequest(
            api.fetchWallets.url(),
            api.fetchWallets.methodType,
            api.fetchWallets.headers(),
            api.fetchWallets.credentials
        );

        setWallets(responseData);

        // if wallets are present in the list
        if (responseData.length > 0) {
          setWalletId(responseData[0].wallet_id);
          localStorage.setItem("walletId", responseData[0].walletId);

          // Fetch user cache to check wallet unlock status
          const userData= await fetchRequest(
            api.fetchUserProfile.url(),
            api.fetchUserProfile.methodType,
            api.fetchUserProfile.headers(),
            api.fetchUserProfile.credentials
          )
          
          // Storing cached wallet Id
          const cachedWalletId = userData.wallet_id;
          if (!cachedWalletId || cachedWalletId !== responseData[0].walletId) {
            // If Wallet is Locked then unlock it on pin page
            navigate("/pin"); // Redirect user to unlock page
          } 
          else {
            // If wallet is already unlocked 
            console.log("Wallet is Already Unlocked");
            navigate("/issuers");
          }

        } else {
          // If no wallet is found
          console.warn("No wallets found, prompting creation...");
          navigate("/pin"); // Redirect to wallet creation
        }
      } catch (error) {
        // in case wallet-fetch fails
        console.error("Error occurred while fetching wallets:", error);
        setError(t("error.fetchWalletsError"));
        navigate("/"); // Redirect to home page for wallet re-creationg
      }
    };
  
    fetchWallets();
  }, []);


  const handleUnlock = async () => {
    setError("");
    setLoading(true);
    setIsPinCorrect(null);

    const walletId = localStorage.getItem("walletId");
    const pin = passcode.join("");

    if (!walletId) {
        setError(t("error.walletNotFoundError"));
        setLoading(false);
        navigate('/');
        return null;
    }

    try {
        const responseData = await fetchRequest(
            api.fetchWalletDetails.url(walletId),
            api.fetchWalletDetails.methodType,
            {
                ...api.fetchWalletDetails.headers(),
                "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
            },
            api.fetchWalletDetails.credentials,
            JSON.stringify({ walletPin: pin })
        );
        const unlockedWalletId = responseData.walletId;
        localStorage.setItem("walletId", unlockedWalletId);
        setIsPinCorrect(true);
        navigate("/issuers"); // Redirect upon successful unlock
    } catch (error) {
        setIsPinCorrect(false);
        setError(t("error.incorrectPinError"));
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    setIsPinCorrect(null);
    const pin = passcode.join("");

    if (wallets.length !== 0) {
        if (pin.length !== 6) {
            setError(t("error.pinLengthError"));
            setLoading(false);
            return;
        }
    } else {
        const confirmPin = confirmPasscode.join("");
        if (pin.length !== 6 || confirmPin.length !== 6) {
            setError(t("error.pinLengthError"));
            setLoading(false);
            return;
        }
        if (wallets.length === 0 && pin !== confirmPin) {
            setError(t("error.passcodeMismatchError"));
            setLoading(false);
            return;
        }
    }

    try {
        if (wallets.length === 0) {
            const response = await fetch(api.createWalletWithPin.url(), {
                method: "POST",
                headers: {
                    ...api.createWalletWithPin.headers(),
                    "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
                },
                credentials: "include",
                body: JSON.stringify({ walletPin: pin, walletName: displayName })
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(`${t("error.createWalletError")}: ${errorData.errorMessage || t("unknown-error")}`);
                setIsPinCorrect(false);
                return;
            }
            const newWalletId = (await response.json()).walletId;
            setWalletId(newWalletId);
            setWallets([{ walletId: newWalletId }]);
            setIsPinCorrect(true);
            localStorage.setItem("walletId", newWalletId);
            navigate("/issuers");
        } else {
            await handleUnlock();
        }
    } catch (error) {
        setIsPinCorrect(false);
        setError(t("error.incorrectPinError"));
    } finally {
        setLoading(false);
    }
};

  const isButtonDisabled = passcode.includes("") || (wallets.length === 0 && confirmPasscode.includes(""));
  return (
    <div className=" overflow-hidden fixed inset-0 backdrop-blur-sm bg-black bg-opacity-40 flex flex-col items-center justify-center z-50" data-testid="pin-page">
        <div className="bg-white sm:mx=4 mx-2 rounded-2xl flex flex-col items-center justify-center py-[2%] px-0 sm:px-[18%] ">
            <div className="text-center mb-2">
                <div className="ps-14 sm:ps-24" data-testid="pin-logo">
                <img src={require("../../assets/Logomark.png")} alt="Inji Web Logo"/>
                </div>
                <h1 className="text-xl sm:text-3xl font-semibold text-gray-800 p-4 " data-testid="pin-title">
                    {wallets.length === 0 ? t("setPasscode") : t("enterPasscode")}
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg" data-testid="pin-description">
                {wallets.length===0? t("setPasscodeDescription"): t("enterPasscodeDescription")}
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm text-center" data-testid="pin-container">
                {wallets.length===0 &&
                    <p className="text-center mx-5 my-4 w-[85%] text-gray-500 text-xs sm:text-sm" data-testid="pin-warning">
                    {t("passcodeWarning")}
                    </p>
                }


                {error && 
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4 flex items-center justify-between" data-testid="pin-error">
                    <div className="flex items-center gap-2">
                        <FaExclamationCircle className="text-red-500 w-4 h-4" />
                        <span className="w-full text-xs">{error}</span>
                    </div>
                </div>
                }

                <div className="mb-2" data-testid="pin-passcode-input">
                <p className="text-xs sm:text-sm text-left font-medium text-gray-700 mb-2">{t("enterPasscode")}</p>
                {renderInputs("passcode", showPasscode, () => setShowPasscode((prev) => !prev))}
                </div>

                {wallets.length === 0 && (
                    <div className="mb-2" data-testid="pin-confirm-passcode-input">
                    <p className="text-xs sm:text-sm text-left font-medium text-gray-700 mb-2">{t("confirmPasscode")}</p>
                    {renderInputs("confirm", showConfirm, () => setShowConfirm((prev) => !prev))}
                </div>
                )}

                {wallets.length !==0 &&(
                    <p className="text-xs sm:text-sm text-left font-semibold text-purple-800 my-3">{t("resetPasscode")}</p>
                )}

                <SolidButton
                fullWidth={true}
                testId="pin-submit-button"
                onClick={handleSubmit}
                title={loading ? t("submitting") : t("submit")}
                disabled={isButtonDisabled}
                className={`${isButtonDisabled ? 'grayscale' : ''}`}
                />
            </div>
        </div>
    </div>
  );
};

export default PinPage;