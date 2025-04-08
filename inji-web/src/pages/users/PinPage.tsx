import React, { useState, useEffect } from 'react';
import { api } from "../../utils/api";
import { useCookies } from 'react-cookie';

const PinPage: React.FC = () => {
    const [pin, setPin] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [wallets, setWallets] = useState<any[]>([]);
    const [isPinCorrect, setIsPinCorrect] = useState<boolean | null>(null);
    const [walletId, setWalletId] = useState<string | null>(null);
    const [cookies] = useCookies(["XSRF-TOKEN"]);

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const response = await fetch(api.fetchWallets.url(), {
                    method: api.fetchWallets.methodType === 0 ? "GET" : "POST",
                    headers: api.fetchWallets.headers(),
                    credentials: "include"
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData);
                }

                setWallets(responseData);
                if (responseData.length > 0) {
                    setWalletId(responseData[0].walletId);
                }
            } catch (error) {
                console.error("Error occurred while fetching wallets:", error);
                setError("Failed to fetch wallets");
            }
        };

        fetchWallets();
    }, []);

    const fetchWalletDetails = async (walletId: string, pin: string) => {
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
                const responseData = await response.json();
                throw responseData;
            }

            return await response.text(); // This line will give walletId in response if wallet details are fetched properly
        } catch (error) {
            console.error(
                "Error occurred while fetching wallet details:",
                JSON.stringify(error, null, 2)
            );
            throw error;
        }
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);
        setIsPinCorrect(null);

        if (!pin) {
            setError("Please enter a PIN.");
            setLoading(false);
            return;
        }

        try {
            if (wallets.length === 0) {
                if (!name) {
                    setError("Please enter a name.");
                    setLoading(false);
                    return;
                }
                // No wallets found, create a new wallet
                const response = await fetch(api.createWalletWithPin.url(), {
                    method: "POST",
                    headers: {
                        ...api.createWalletWithPin.headers(),
                        "Content-Type": "application/json",
                        "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
                    },
                    credentials: "include",
                    body: JSON.stringify({ walletPin: pin, walletName: name })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(
                        "Error occurred while creating wallet:",
                        errorData
                    );
                    setError(
                        `Failed to create wallet: ${errorData.errorMessage || "Unknown error"}`
                    );
                    setIsPinCorrect(false);
                    return;
                }

                const walletId = await response.text();
                setWalletId(walletId);
                setWallets([{ walletId }]); // Update wallets state to reflect the new wallet

                setIsPinCorrect(true);
                setError(`Wallet created successfully! Wallet ID: ${walletId}`);
            } else {
                const walletData = await fetchWalletDetails(walletId!, pin);
                console.log("wallet data::", walletData);
                setIsPinCorrect(true);
            }
        } catch (error) {
            setIsPinCorrect(false);
            setError("An error occurred. Please try again.");
            console.error("An error occurred while creating wallet:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pin-container">
            {wallets.length > 0 ? (
                <>
                    <br />
                    <br />
                    <h2>Unlock Wallet : {walletId}</h2>
                    <h3>Enter PIN</h3>
                    <input
                        type="password"
                        placeholder="Enter your PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        disabled={loading}
                    />
                </>
            ) : (
                <>
                    <br />
                    <br />
                    <h2>Create Wallet</h2>
                    <h3>Enter Name and PIN</h3>
                    <input
                        type="text"
                        placeholder="Enter your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                    <br />
                    <br />
                    <input
                        type="password"
                        placeholder="Enter your PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        disabled={loading}
                    />
                </>
            )}
            <br />
            <br />
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>

            {error && <p className="error-message">{error}</p>}

            {isPinCorrect !== null && (
                <p
                    className={
                        isPinCorrect ? "success-message" : "error-message"
                    }
                >
                    {isPinCorrect
                        ? "PIN is correct! Wallet data fetched successfully."
                        : "Incorrect PIN. Please try again."}
                </p>
            )}
        </div>
    );
};

export default PinPage;