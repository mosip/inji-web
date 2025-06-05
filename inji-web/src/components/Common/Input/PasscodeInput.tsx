import React, {useRef, useState} from 'react';
import {FaEye, FaEyeSlash} from 'react-icons/fa';

interface PasscodeInputProps {
    label: string;
    value: string[];
    onChange: (values: string[]) => void;
    testId?: string;
}

export const PasscodeInput: React.FC<PasscodeInputProps> = ({
    label,
    value,
    onChange,
    testId
}) => {
    const [showPasscode, setShowPasscode] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInputChange = (index: number, digit: string) => {
        if (!/\d/.test(digit) && digit !== '') return;

        const newValues = [...value];
        newValues[index] = digit;
        onChange(newValues);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    return (
        <div className="mb-2" data-testid={`${testId}-container`}>
            <p
                data-testid={`label-${testId}`}
                className="text-sm text-left font-medium text-iw-textSecondary"
            >
                {label}
            </p>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 py-2 rounded-lg">
                    {value.map((digit, idx) => (
                        <input
                            key={idx}
                            data-testid={`input-${testId}`}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type={showPasscode ? 'text' : 'password'}
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleInputChange(idx, e.target.value)
                            }
                            onFocus={(e) => {
                                e.target.classList.add(
                                    'pin-input-focus-box-border'
                                );
                            }}
                            onBlur={(e) => {
                                if (!digit) {
                                    e.target.classList.remove(
                                        'pin-input-focus-box-border'
                                    );
                                    e.target.classList.add(
                                        'pin-input-box-border'
                                    );
                                }
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === 'Backspace' &&
                                    idx > 0 &&
                                    !digit
                                ) {
                                    inputRefs.current[idx - 1]?.focus();
                                }
                            }}
                            className={`pin-input-box-style ${
                                digit
                                    ? 'pin-input-focus-box-border'
                                    : 'pin-input-box-border'
                            } focus:outline-none`}
                        />
                    ))}
                </div>
                <div className="flex items-center gap-4 py-2 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setShowPasscode((prev) => !prev)}
                        className="pin-input-box-border pin-input-box-style flex items-center justify-center focus:outline-none"
                    >
                        {showPasscode ? (
                            <FaEye className="text-iw-grayLight" />
                        ) : (
                            <FaEyeSlash className="text-iw-grayLight" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
