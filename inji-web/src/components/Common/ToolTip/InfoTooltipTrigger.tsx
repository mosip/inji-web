import React, { useState } from 'react';

interface InfoTooltipTriggerProps {
    infoButtonText: string; 
    tooltipText: string;    
    buttonId?: string;
    className?: string; 
}


export const InfoTooltipTrigger: React.FC<InfoTooltipTriggerProps> = ({
    infoButtonText,
    tooltipText,
    buttonId = 'trustscreen-info-button',
    className = '',
}) => {

    const [showTooltip, setShowTooltip] = useState(false);

    
    const handleToggle = () => setShowTooltip(prev => !prev);

    const handleMouseEnter = () => setShowTooltip(true);
    const handleMouseLeave = () => setShowTooltip(false);

    return (
        <div className={`relative inline-block mt-4 sm:mt-5 ${className}`}>
           
            <button
                id={buttonId}
                onClick={handleToggle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="flex items-center text-gray-500 hover:text-gray-700 text-sm focus:outline-none"
                aria-describedby={`tooltip-${buttonId}`}
            >
                <span className="text-lg mr-1" role="img" aria-label="Information icon">ℹ️</span>
                <span>{infoButtonText}</span> 
            </button>
            {showTooltip && (
                <div
                    id={`tooltip-${buttonId}`}
                    role="tooltip"
                    className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 z-10 bg-[#5A26C5] text-white text-sm rounded-xl shadow-lg p-3 w-[290px] md:w-[380px] pr-[60px]"
                    style={{
                        filter: "drop-shadow(0px 2px 6px rgba(0,0,0,0.2))",
                    }}
                >
                    <div className="absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-full">
                        <svg
                            className="w-4 h-4 text-[#5A26C5]"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <polygon points="0,0 10,20 20,0" />
                        </svg>
                    </div>

                    <p className="text-sm leading-snug text-left">
                        {tooltipText} 
                    </p>
                </div>
            )}
        </div>
    );
};
