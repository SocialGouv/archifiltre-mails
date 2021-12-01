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

export const TrashPicto: React.FC = () => (
    <svg
        fill="none"
        height="24"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
);
export const KeepPicto: React.FC = () => (
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
        <path d="M22 11.07V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="23 3 12 14 9 11" />
    </svg>
);
export const FilterPicto: React.FC = () => (
    <svg
        fill="none"
        height="24"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);
export const ImportPicto: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        className="icon filter-icon icon-14"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 6C0 5.17157 0.671573 4.5 1.5 4.5H22.5C23.3284 4.5 24 5.17157 24 6C24 6.82843 23.3284 7.5 22.5 7.5H1.5C0.671573 7.5 0 6.82843 0 6ZM3 12C3 11.1716 3.67157 10.5 4.5 10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H4.5C3.67157 13.5 3 12.8284 3 12ZM7.5 16.5C6.67157 16.5 6 17.1716 6 18C6 18.8284 6.67157 19.5 7.5 19.5H16.5C17.3284 19.5 18 18.8284 18 18C18 17.1716 17.3284 16.5 16.5 16.5H7.5Z"
        />
    </svg>
);
export const ExportPicto: React.FC = () => (
    <svg
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <polyline
            fill="none"
            points="16 6 12 2 8 6"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <line
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="12"
            x2="12"
            y1="2"
            y2="15"
        />
    </svg>
);
