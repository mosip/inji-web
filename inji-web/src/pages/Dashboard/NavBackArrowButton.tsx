import { NavBackArrowButtonProps } from "../../types/data";

export const NavBackArrowButton: React.FC<NavBackArrowButtonProps> = ({onBackClick: handleBackClick}) => (
    <svg
        data-testid={'Back-Arrow-Icon'}
        width="29"
        height="29"
        viewBox="0 0 24 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2 cursor-pointer"
        onClick={handleBackClick}
    >
        <path
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            fill="#000000"
        />
    </svg>
);