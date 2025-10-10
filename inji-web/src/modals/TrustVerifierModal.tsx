import React, { useState } from "react";
import { ModalWrapper } from "./ModalWrapper";

interface TrustVerifierModalProps {
    isOpen: boolean;
    logo?: string | null;
    verifierName?: string;
    verifierDomain?: string;
    onTrust?: () => void;
    onNotTrust?: () => void;
    onCancel?: () => void;
}

export const TrustVerifierModal: React.FC<TrustVerifierModalProps> = ({
    isOpen,
    logo,
    verifierName = "Verifier Name",
    verifierDomain = "verify.gov.in",
    onTrust,
    onNotTrust,
    onCancel = () => { },
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    if (!isOpen) return null;

    return (
        <ModalWrapper
            zIndex={50}
            size="xl"
            header={<></>}
            footer={<></>}
            content={
                <div
                    data-testid="trust-verifier-content"
                    // ✏️ Reduced horizontal padding for small screens (px-4) but kept larger for 'md' and up (md:px-6)
                    className="flex flex-col items-center text-center px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn"
                >
                    {/* 🖼️ Verifier Logo (optional) */}
                    {/* Kept size consistent as it's a fixed element */}
                    <div className="h-20 w-20 mb-4 flex items-center justify-center">
                        {logo ? (
                            <img
                                src={logo}
                                alt={`${verifierName} logo`}
                                className="h-20 w-20 object-contain rounded-full border border-gray-200 shadow-sm"
                            />
                        ) : (
                            // Empty placeholder when no logo (keeps spacing consistent)
                            <div className="h-20 w-20 rounded-full bg-gray-100" />
                        )}
                    </div>

                    {/* 🔷 Verifier Name */}
                    {/* Reduced font size slightly for small screens (text-xl sm:text-2xl) */}
                    <h1
                        id="trustscreen-title"
                        className="text-xl sm:text-2xl font-semibold text-gray-900"
                    >
                        {verifierName}
                    </h1>

                    {/* 🔗 Verifier Domain */}
                    <p className="text-sm text-gray-500 mt-1">{verifierDomain}</p>

                    {/* 📝 Description */}
                    {/* Kept font size consistent (text-base) */}
                    <p
                        id="trustscreen-description"
                        className="text-gray-600 mt-4 text-base leading-relaxed px-2 sm:px-0"
                    >
                        Make sure you recognize or trust this issuer.
                        <br />
                        Once you trust this Verifier:
                    </p>

                    {/* 📋 Info List */}
                    {/* Ensured full width on smaller screens, using max-w-sm for small/medium, and max-w-md for large */}
                    <ul className="text-left text-gray-700 mt-6 mb-8 space-y-4 w-full max-w-sm sm:max-w-md">
                        {[
                            "The card will be securely saved in your wallet.",
                            "This verifier will be added to your trusted list.",
                            "You won’t need to review trust again when downloading from them next time.",
                        ].map((text, i) => (
                            <li key={i} className="flex items-center">
                                <span className="text-[40px] leading-[1] mr-3 text-[#951F6F] relative top-[-6px]" aria-hidden="true" >
                                    •
                                </span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* 🎯 Action Buttons */}
                    {/* Ensured full width on smaller screens, using max-w-sm for small/medium, and max-w-md for large */}
                    <div className="flex flex-col w-full max-w-sm sm:max-w-md space-y-3 mt-4 sm:mt-6">
                        <button
                            id="trustscreen-yes-button"
                            onClick={onTrust}
                            className="bg-[linear-gradient(90deg,_#FF5300_0%,_#FB5103_16%,_#F04C0F_31%,_#DE4322_46%,_#C5363C_61%,_#A4265F_75%,_#7C1389_90%,_#5B03AD_100%)]
                     text-white font-semibold py-3 rounded-md hover:opacity-90 transition-all duration-200"
                        >
                            Yes, I trust this Verifier
                        </button>

                        <button
                            id="trustscreen-no-button"
                            onClick={onNotTrust}
                            className="border-2 border-[#D64246] text-[#D64246] font-semibold py-3 rounded-md hover:bg-gray-50 transition-all duration-200"
                        >
                            No, I don’t trust this Verifier
                        </button>

                        <button
                            id="trustscreen-cancel-button"
                            onClick={onCancel}
                            className="text-purple-600 hover:underline font-medium py-2"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* 💬 Info Tooltip */}
                    <div className="relative inline-block mt-4 sm:mt-5">
                        <button
                            id="trustscreen-info-button"
                            onClick={() => setShowTooltip(!showTooltip)}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="flex items-center text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                        >
                            <span className="text-lg mr-1">ℹ️</span>
                            <span>What does trusting mean?</span>
                        </button>

                        {/* Adjusted tooltip width to be smaller on small screens (w-64 sm:w-72) */}
                        {showTooltip && (
                            <div
                                className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 z-10 bg-[#5A26C5] text-white text-sm rounded-xl shadow-lg p-3 w-64 sm:w-72"
                                style={{
                                    filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.2))",
                                }}
                            >
                                {/* 🔽 Tooltip Arrow */}
                                <div className="absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-full">
                                    <svg
                                        className="w-4 h-4 text-[#5A26C5]"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <polygon points="0,0 10,20 20,0" />
                                    </svg>
                                </div>

                                <p className="text-sm leading-snug">
                                    Trusting a verifier allows them to request your credentials.
                                    You’ll still choose which credentials to share in the next
                                    step.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            }
        />
    );
};