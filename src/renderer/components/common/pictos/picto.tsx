import React from "react";

export const HomePicto: React.FC = () => (
    <svg
        fill="none"
        height="24"
        stroke="#fff"
        // stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
    >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

export const EarthPicto: React.FC = () => (
    <svg
        fill="none"
        height="24"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

export const HistoryPicto: React.FC = () => (
    <svg height="24" viewBox="0 0 24 24" width="24">
        <path
            d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"
            fill="none"
            stroke="#0f0f0f"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <polyline
            fill="none"
            points="2.32 6.16 12 11 21.68 6.16"
            stroke="#0f0f0f"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <line
            fill="none"
            stroke="#0f0f0f"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="12"
            x2="12"
            y1="22.76"
            y2="11"
        />
        <line
            fill="none"
            stroke="#0f0f0f"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="7"
            x2="17"
            y1="3.5"
            y2="8.5"
        />
    </svg>
);

export const ClosePicto: React.FC = () => (
    <svg
        fill="none"
        height="24"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
    >
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
);

export const ArrowPicto: React.FC = () => (
    <svg viewBox="0 0 30.125 18.1738">
        <path
            d="M29.75,9.3948,21.5281,1.1735a.8479.8479,0,0,0-.601-.261L20.9124.9119a.8526.8526,0,0,0-.5956.2409.8642.8642,0,0,0-.0027,1.23l6.7618,6.7611H.7316a.8566.8566,0,1,0,0,1.7131H27.0759l-6.7591,6.7591a.8576.8576,0,0,0-.0214,1.2113.8462.8462,0,0,0,.61.2583.8949.8949,0,0,0,.621-.2556l8.2233-8.224A.8587.8587,0,0,0,29.75,9.3948Z"
            transform="translate(0.125 -0.9119)"
        />
    </svg>
);
