import React from "react";

export function DownloadIcon({ gradient = false, style, ...props }: { gradient?: boolean, style?: React.CSSProperties, testId: string} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-label={"icon-download"}
      data-testid={props.testId}
      {...props}
    >
      {gradient && (
        <defs>
          <linearGradient id="downloadGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6a11cb"/>
            <stop offset="1" stopColor="#2575fc"/>
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 15.7885L7.73075 11.5192L8.78475 10.4348L11.25 12.9V4.5H12.75V12.9L15.2153 10.4348L16.2693 11.5192L12 15.7885ZM6.30775 19.5C5.80258 19.5 5.375 19.325 5.025 18.975C4.675 18.625 4.5 18.1974 4.5 17.6923V14.9808H6V17.6923C6 17.7692 6.03208 17.8398 6.09625 17.9038C6.16025 17.9679 6.23075 18 6.30775 18H17.6923C17.7692 18 17.8398 17.9679 17.9038 17.9038C17.9679 17.8398 18 17.7692 18 17.6923V14.9808H19.5V17.6923C19.5 18.1974 19.325 18.625 18.975 18.975C18.625 19.325 18.1974 19.5 17.6923 19.5H6.30775Z"
        fill={gradient ? "url(#downloadGradient)" : "currentColor"}
      />
    </svg>
  );
}