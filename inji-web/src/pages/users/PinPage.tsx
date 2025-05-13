import { FaExclamationCircle } from "react-icons/fa";
import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { useCookies } from "react-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SolidButton } from "../../components/Common/Buttons/SolidButton";
import { useTranslation } from "react-i18next";

export const PinPage: React.FC = () => {
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
        const response = await fetch(api.fetchWallets.url(), {
          method: "GET",
          headers: api.fetchWallets.headers(),
          credentials: "include",
        });
  
        const responseData = await response.json();
  
        if (!response.ok) {
          throw new Error(responseData);
        }

        setWallets(responseData);

        // if wallets are present in the list
        if (responseData.length > 0) {
          setWalletId(responseData[0].wallet_id);
          localStorage.setItem("walletId", responseData[0].walletId);
          localStorage.setItem("displayName",responseData[0].displayName);
          console.log("Fetch wallets responseData[0] "+responseData[0].walletId);

          // Fetch user cache to check wallet unlock status
          const userResponse = await fetch(api.fetchUserProfile.url(), {
            method: "GET",
            headers: api.fetchUserProfile.headers(),
            credentials: "include",
          });
  
          const userData = await userResponse.json();
          if (!userResponse.ok) {
            throw new Error(userData);
          }
          
          // Storing cached wallet Id
          const cachedWalletId = userData.wallet_id;
          if (!cachedWalletId || cachedWalletId !== responseData[0].walletId) {
            // If Wallet is Locked then unlock it on pin page
            console.warn("Wallet is locked or missing, redirecting to unlock...");
            navigate("/pin"); // Redirect user to unlock page
          } 
          else {
            // If wallet is already unlocked 
            console.log("Wallet is Already Unlocked");
            navigate("/issuers");
          }

        } else {
          // If no wallet is found
          alert("No wallets found");
          console.warn("No wallets found, prompting creation...");
          navigate("/pin"); // Redirect to wallet creation
        }
      } catch (error) {
        // in case wallet-fetch fails
        console.error("Error occurred while fetching wallets:", error);
        setError(t("error.fetch-wallets-error"));
        navigate("/"); // Redirect to home page for wallet re-creationg
      }
    };
  
    fetchWallets();
  }, []);


  useEffect(() => {
    setDisplayName(localStorage.getItem("displayName"));
  }, [localStorage.getItem("displayName")]);


  const handleUnlock = async () => {
    setError("");
    setLoading(true);
    setIsPinCorrect(null);

    const walletId = localStorage.getItem("walletId");
    const pin = passcode.join("");

    // Optional Error Handling, already handled in handle submit
    if (!walletId) {
        setError(t("error.wallet-not-found-error"));
        setLoading(false);
        navigate('/');
        return null;
    }

    try {
        const response = await fetch(api.fetchWalletDetails.url(walletId), {
          method: api.fetchWalletDetails.methodType === 0 ? "GET" : "POST",
            headers: {
                ...api.fetchWalletDetails.headers(),
                "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
            },
            credentials: "include",
            body: JSON.stringify({ walletPin: pin })
        });

        if (!response.ok) {
            throw new Error("Wallet unlock failed");
        }

        const unlockedWalletId = await response.json();
        localStorage.setItem("walletId", unlockedWalletId);
        setIsPinCorrect(true);
        navigate("/issuers"); // Redirect upon successful unlock
    } catch (error) {
        setIsPinCorrect(false);
        setError(t("error.incorrect-pin-error"));
        // should I clear the local-storage in case of wrong input?
        // localStorage.removeItem("walletId");
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
            setError(t("error.pin-length-error"));
            setLoading(false);
            return;
        }
    } else {
        const confirmPin = confirmPasscode.join("");
        if (pin.length !== 6 || confirmPin.length !== 6) {
            setError(t("error.pin-length-error"));
            setLoading(false);
            return;
        }
        if (wallets.length === 0 && pin !== confirmPin) {
            setError(t("error.passcode-mismatch-error"));
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
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
                },
                credentials: "include",
                body: JSON.stringify({ walletPin: pin, walletName: displayName })
            });
            if (!response.ok) {
                const errorData = await response.json();
                setError(`${t("error.create-wallet-error")}: ${errorData.errorMessage || t("unknown-error")}`);
                setIsPinCorrect(false);
                return;
            }
            const newWalletId = await response.text();
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
        setError(t("error.incorrect-pin-error"));
        // should I clear the local-storage in case of worng input?
        // localStorage.removeItem("walletId");
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
                    {wallets.length === 0 ? t("set-passcode") : t("enter-passcode")}
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg" data-testid="pin-description">
                {wallets.length===0? t("set-passcode-description"): t("enter-passcode-description")}
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm text-center" data-testid="pin-container">
                {wallets.length===0 &&
                    <p className="text-center mx-5 my-4 w-[85%] text-gray-500 text-xs sm:text-sm" data-testid="pin-warning">
                    {t("passcode-warning")}
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
                <p className="text-xs sm:text-sm text-left font-medium text-gray-700 mb-2">{t("enter-passcode")}</p>
                {renderInputs("passcode", showPasscode, () => setShowPasscode((prev) => !prev))}
                </div>

                {wallets.length === 0 && (
                    <div className="mb-2" data-testid="pin-confirm-passcode-input">
                    <p className="text-xs sm:text-sm text-left font-medium text-gray-700 mb-2">{t("confirm-passcode")}</p>
                    {renderInputs("confirm", showConfirm, () => setShowConfirm((prev) => !prev))}
                </div>
                )}

                {/* Reset Passcode, to be completed in next ticket. Backend architecture unavaliable as of now */}
                {wallets.length !==0 &&(
                    <p className="text-xs sm:text-sm text-left font-semibold text-purple-800 my-3">{t("reset-passcode")}</p>
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