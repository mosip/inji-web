import React from "react";

export const Separator = ({className = ""}: {
    className?: string
}) => {
    return (
        <div className={`flex items-center w-full ${className}`}>
            <hr className="flex-grow border-t border-gray-300"/>
        </div>
    )
}