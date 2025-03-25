import React, { useState, useEffect } from 'react';
import { api } from "../../utils/api";
import { useCookies } from 'react-cookie';

const PinPage: React.FC = () => {
    const [pin, setPin] = useState<string>(''); // State to store the entered PIN
    const [name, setWalletName] = useState<string>(''); // State to store the entered wallet name
    const [error, setError] = useState<string>(''); // State for error message
    const [loading, setLoading] = useState<boolean>(false); // Loading state for the submit button
    const [wallets, setWallets] = useState<any[]>([]); // State to store wallets data
    const [isPinCorrect, setIsPinCorrect] = useState<boolean | null>(null); // State for checking PIN validity
    const [walletId, setWalletId] = useState<string | null>(null); // State for wallet ID
    const [cookies] = useCookies(['XSRF-TOKEN']);

    useEffect(() => {
        // Function to fetch wallets on page load
        const fetchWallets = async () => {
            try {
                const response = await fetch(api.fetchWallets.url(), {
                    method: api.fetchWallets.methodType === 0 ? 'GET' : 'POST',
                    headers: api.fetchWallets.headers(),
                    credentials: 'include',
                });

                const data = await response.json();
                setWallets(data.response); // Store fetched wallets in state
                if (data.response.length > 0) {
                    setWalletId(data.response[0]); // Set the first wallet ID if wallets exist
                }
            } catch (error) {
                setError('Failed to fetch wallets.');
            }
        };

        fetchWallets(); // Fetch wallets when component mounts
    }, []);

    // Function to fetch wallet details
    const fetchWalletDetails = async (walletId: string, pin: string) => {
        try {
            const response = await fetch(api.fetchWalletDetails.url(walletId), {
                method: api.fetchWalletDetails.methodType === 0 ? 'GET' : 'POST',
                headers: {
                    ...api.fetchWalletDetails.headers(),
                    'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                },
                credentials: 'include',
                body: JSON.stringify({ pin })
            });

            // Check if the response is successful
            if (!response.ok) {
                // If the status code is not 200, throw an error
                throw new Error(`Failed to fetch wallet details. Status: ${response.status}`);
            }

            // If response is okay, parse and return the data
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching wallet details:', error);
            throw error; // Re-throw the error so it can be handled in the calling function
        }
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        setError('');
        setLoading(true); // Set loading to true to disable button
        setIsPinCorrect(null); // Reset PIN correctness before each submission

        if (!pin || !name) {
            setError('Please enter both a PIN and wallet name.');
            setLoading(false); // Disable loading if PIN or wallet name is not entered
            return;
        }

        try {
            if (wallets.length === 0) {
                // No wallets found, create a new wallet
                const postResponse = await fetch(api.createWalletWithPin.url(), {
                    method: 'POST',
                    headers: {
                        ...api.createWalletWithPin.headers(),
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                    },
                    credentials: 'include',
                    body: JSON.stringify({ pin, name }) // Pass both PIN and wallet name as JSON in the body
                });

                // Check if the response is successful
                if (!postResponse.ok) {
                    const errorData = await postResponse.json();
                    console.error('Error creating wallet:', errorData);
                    setError(`Failed to create wallet: ${errorData.message || 'Unknown error'}`);
                    setIsPinCorrect(false);
                    return;
                }

                // If wallet is successfully created, proceed with showing the wallet ID
                const postData = await postResponse.json();
                const walletId = postData.response; // Assuming response contains the walletId
                setWalletId(walletId); // Set the created wallet ID

                // Show success message with the created wallet ID
                setIsPinCorrect(true); // Mark the PIN as correct
                setError(`Wallet created successfully! Wallet ID: ${walletId}`); // Display the success message
            } else {
                // Wallets exist, check if PIN is correct for the selected wallet
                const walletData = await fetchWalletDetails(walletId!, pin); // Fetch wallet details for the selected wallet
                if (walletData.error) {
                    setIsPinCorrect(false); // Set to false if error occurs (e.g. incorrect PIN)
                } else {
                    setIsPinCorrect(true); // Success, PIN is correct
                    console.log('Wallet Data:', walletData); // Handle wallet data here
                }
            }
        } catch (error) {
            setIsPinCorrect(false); // If there is an error (e.g. statusCode 500), mark PIN as incorrect
            setError('An error occurred. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    };

    return (
        <div className="pin-container">
               {/* If wallets exist, show wallet ID */}
                        {wallets.length > 0 && walletId && (
                            <p>Wallet ID: {walletId}</p>
                        )}
            <h2>Enter PIN and Wallet Name</h2>



            {/* Input for PIN */}
            <input
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={loading} // Disable input while loading
            />
            <br/>
             <br/>
            {/* Input for Wallet Name */}
            <input
                type="text"
                placeholder="Enter your wallet name"
                value={name}
                onChange={(e) => setWalletName(e.target.value)}
                disabled={loading} // Disable input while loading
            />

            {/* Submit button */}
            <button
                onClick={handleSubmit}
                disabled={loading} // Disable button while loading
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>

            {/* Error message */}
            {error && <p className="error-message">{error}</p>}

            {/* Show success or failure message based on PIN validity */}
            {isPinCorrect !== null && (
                <p className={isPinCorrect ? 'success-message' : 'error-message'}>
                    {isPinCorrect ? 'PIN is correct! Wallet data fetched successfully.' : 'Incorrect PIN. Please try again.'}
                </p>
            )}
        </div>
    );
};

export default PinPage;
