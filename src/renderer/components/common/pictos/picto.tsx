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
export const ImportPicto: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
    >
        <path
            d="M12.25 10C6.037 10 1 7.985 1 5.5C1 3.015 6.037 1 12.25 1C18.463 1 23.5 3.014 23.5 5.5C23.5 6.827 22.065 8.019 19.781 8.843"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M23.5 10V5.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1 5.5V11.5C1 13.458 4.129 15.125 8.5 15.743"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1 11.5V17.5C1 19.568 4.487 21.31 9.237 21.836"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11.5 17.5C11.5 19.0913 12.1321 20.6174 13.2574 21.7426C14.3826 22.8679 15.9087 23.5 17.5 23.5C19.0913 23.5 20.6174 22.8679 21.7426 21.7426C22.8679 20.6174 23.5 19.0913 23.5 17.5C23.5 15.9087 22.8679 14.3826 21.7426 13.2574C20.6174 12.1321 19.0913 11.5 17.5 11.5C15.9087 11.5 14.3826 12.1321 13.2574 13.2574C12.1321 14.3826 11.5 15.9087 11.5 17.5V17.5Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.5 14.5V20.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.5 20.5L15.25 18.25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.5 20.5L19.75 18.25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
export const FilterPicto: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#fff"
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
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <polyline
            fill="none"
            points="16 6 12 2 8 6"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
        />
        <line
            fill="none"
            stroke="#fff"
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

export const SearchPicto: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#ccc"
    >
        <path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z" />
    </svg>
);

export const ContactPicto: React.FC = () => (
    <svg width="51" height="51" viewBox="0 0 51 51" fill="none">
        <path
            d="M10.3333 19.1875V30.4792L2 24.9167L10.3333 19.1875ZM49.9167 24.9167L41.5833 30.4792V19.1875L49.9167 24.9167Z"
            fill="#66E1FF"
        />
        <path
            d="M49.9167 24.9167V46.7917C49.9167 47.6205 49.5874 48.4153 49.0014 49.0014C48.4153 49.5874 47.6205 49.9167 46.7917 49.9167H5.125C4.2962 49.9167 3.50134 49.5874 2.91529 49.0014C2.32924 48.4153 2 47.6205 2 46.7917V24.9167L10.3333 30.4792L18.1875 35.7083L18.6667 35.3333H33.25L33.7292 35.7083L41.5833 30.4792L49.9167 24.9167Z"
            fill="#C2F3FF"
        />
        <path
            d="M41.5833 4.08333V30.4792L33.7291 35.7083L33.2499 35.3333H18.6666L18.1874 35.7083L10.3333 30.4792V4.08333C10.3333 3.5308 10.5527 3.0009 10.9434 2.61019C11.3341 2.21949 11.8641 2 12.4166 2H39.4999C40.0525 2 40.5824 2.21949 40.9731 2.61019C41.3638 3.0009 41.5833 3.5308 41.5833 4.08333Z"
            fill="#E3E3E3"
        />
        <path
            d="M39.4999 2H12.4166C11.8641 2 11.3341 2.21949 10.9434 2.61019C10.5527 3.0009 10.3333 3.5308 10.3333 4.08333V30.4792L11.3416 31.15L40.3187 2.17083C40.0603 2.05863 39.7816 2.00049 39.4999 2Z"
            fill="white"
        />
        <path
            d="M25.9583 25.9583C30.5607 25.9583 34.2917 22.2274 34.2917 17.625C34.2917 13.0226 30.5607 9.29167 25.9583 9.29167C21.356 9.29167 17.625 13.0226 17.625 17.625C17.625 22.2274 21.356 25.9583 25.9583 25.9583Z"
            fill="#66E1FF"
        />
        <path
            d="M41.5833 19.1875L49.9167 24.9167V46.7917C49.9167 47.6205 49.5874 48.4153 49.0014 49.0014C48.4153 49.5874 47.6205 49.9167 46.7917 49.9167H5.125C4.2962 49.9167 3.50134 49.5874 2.91529 49.0014C2.32924 48.4153 2 47.6205 2 46.7917V24.9167L10.3333 19.1875"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.25 43.6667L18.6667 35.3333H33.25L43.6667 43.6667M49.9167 24.9167L37.4167 33.25M2 24.9167L14.5 33.25M41.5833 30.4729V4.08333C41.5833 3.5308 41.3638 3.0009 40.9731 2.61019C40.5824 2.21949 40.0525 2 39.5 2H12.4167C11.8641 2 11.3342 2.21949 10.9435 2.61019C10.5528 3.0009 10.3333 3.5308 10.3333 4.08333V30.4729"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M25.9583 20.75C27.6841 20.75 29.0833 19.3509 29.0833 17.625C29.0833 15.8991 27.6841 14.5 25.9583 14.5C24.2324 14.5 22.8333 15.8991 22.8333 17.625C22.8333 19.3509 24.2324 20.75 25.9583 20.75Z"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M29.0833 17.625V19.1875C29.0833 19.8782 29.3576 20.5406 29.846 21.0289C30.3344 21.5173 30.9968 21.7917 31.6874 21.7917C32.3781 21.7917 33.0405 21.5173 33.5289 21.0289C34.0172 20.5406 34.2916 19.8782 34.2916 19.1875V18.0125C34.3283 15.7902 33.5023 13.6402 31.9873 12.014C30.4722 10.3879 28.3859 9.41209 26.1666 9.29167C24.102 9.22498 22.0861 9.92751 20.5101 11.263C18.9341 12.5985 17.9103 14.4717 17.6373 16.5193C17.3643 18.5669 17.8615 20.6429 19.0326 22.3447C20.2036 24.0464 21.9649 25.2526 23.9749 25.7292C25.3315 26.0487 26.7457 26.0309 28.0937 25.6771"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const MailPicto: React.FC = () => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path
            d="M48.9584 34.375V46.875C48.9584 47.4276 48.7389 47.9575 48.3482 48.3482C47.9575 48.7389 47.4276 48.9584 46.8751 48.9584H3.12508C2.57255 48.9584 2.04264 48.7389 1.65194 48.3482C1.26124 47.9575 1.04175 47.4276 1.04175 46.875V34.375H15.6251V36.4584C15.6284 37.5624 16.0684 38.6203 16.8491 39.401C17.6298 40.1817 18.6877 40.6217 19.7917 40.625H30.2084C31.3125 40.6217 32.3704 40.1817 33.1511 39.401C33.9317 38.6203 34.3718 37.5624 34.3751 36.4584V34.375H48.9584Z"
            fill="#FFDDA1"
        />
        <path
            d="M48.9584 34.375H34.3751V36.4583C34.3718 37.5624 33.9317 38.6203 33.1511 39.401C32.3704 40.1817 31.3125 40.6217 30.2084 40.625H19.7917C18.6877 40.6217 17.6298 40.1817 16.8491 39.401C16.0684 38.6203 15.6284 37.5624 15.6251 36.4583V34.375H1.04175L7.72925 22.9167C7.91103 22.6018 8.17205 22.34 8.48636 22.1573C8.80068 21.9745 9.15735 21.8772 9.52092 21.875H40.4584C40.8255 21.8736 41.1865 21.9691 41.5048 22.1521C41.8231 22.335 42.0874 22.5988 42.2709 22.9167L48.9584 34.375Z"
            fill="#FFBC44"
        />
        <path
            d="M1.04175 34.375V46.875C1.04175 47.4276 1.26124 47.9575 1.65194 48.3482C2.04264 48.7389 2.57255 48.9584 3.12508 48.9584H46.8751C47.4276 48.9584 47.9575 48.7389 48.3482 48.3482C48.7389 47.9575 48.9584 47.4276 48.9584 46.875V34.375M1.04175 34.375H15.6251V36.4584C15.6284 37.5624 16.0684 38.6203 16.8491 39.401C17.6298 40.1817 18.6877 40.6217 19.7917 40.625H30.2084C31.3125 40.6217 32.3704 40.1817 33.1511 39.401C33.9317 38.6203 34.3718 37.5624 34.3751 36.4584V34.375H48.9584M1.04175 34.375L7.73133 22.9167C7.91365 22.6009 8.17565 22.3385 8.49116 22.1557C8.80666 21.9729 9.16462 21.8761 9.52925 21.875H13.5417M48.9584 34.375L42.2688 22.9167C42.0865 22.6009 41.8245 22.3385 41.509 22.1557C41.1935 21.9729 40.8356 21.8761 40.4709 21.875H36.4584M25.0001 23.9584V1.04169M25.0001 23.9584L33.3334 15.625M25.0001 23.9584L16.6667 15.625"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const MailSentPicto: React.FC = () => (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path
            d="M48.9584 34.375V46.875C48.9584 47.4276 48.7389 47.9575 48.3482 48.3482C47.9575 48.7389 47.4276 48.9584 46.8751 48.9584H3.12508C2.57255 48.9584 2.04264 48.7389 1.65194 48.3482C1.26124 47.9575 1.04175 47.4276 1.04175 46.875V34.375H15.6251V36.4584C15.6284 37.5624 16.0684 38.6203 16.8491 39.401C17.6298 40.1817 18.6877 40.6217 19.7917 40.625H30.2084C31.3125 40.6217 32.3704 40.1817 33.1511 39.401C33.9317 38.6203 34.3718 37.5624 34.3751 36.4584V34.375H48.9584Z"
            fill="#FFDDA1"
        />
        <path
            d="M48.9584 34.375H34.3751V36.4583C34.3718 37.5624 33.9317 38.6203 33.1511 39.401C32.3704 40.1817 31.3125 40.6217 30.2084 40.625H19.7917C18.6877 40.6217 17.6298 40.1817 16.8491 39.401C16.0684 38.6203 15.6284 37.5624 15.6251 36.4583V34.375H1.04175L7.72925 22.9167C7.91103 22.6018 8.17205 22.34 8.48636 22.1573C8.80068 21.9745 9.15735 21.8772 9.52092 21.875H40.4584C40.8255 21.8736 41.1865 21.9691 41.5048 22.1521C41.8231 22.335 42.0874 22.5988 42.2709 22.9167L48.9584 34.375Z"
            fill="#FFBC44"
        />
        <path
            d="M1.04175 34.375V46.875C1.04175 47.4276 1.26124 47.9575 1.65194 48.3482C2.04264 48.7389 2.57255 48.9584 3.12508 48.9584H46.8751C47.4276 48.9584 47.9575 48.7389 48.3482 48.3482C48.7389 47.9575 48.9584 47.4276 48.9584 46.875V34.375M1.04175 34.375H15.6251V36.4584C15.6284 37.5624 16.0684 38.6203 16.8491 39.401C17.6298 40.1817 18.6877 40.6217 19.7917 40.625H30.2084C31.3125 40.6217 32.3704 40.1817 33.1511 39.401C33.9317 38.6203 34.3718 37.5624 34.3751 36.4584V34.375H48.9584M1.04175 34.375L7.73133 22.9167C7.91365 22.6009 8.17565 22.3385 8.49116 22.1557C8.80666 21.9729 9.16462 21.8761 9.52925 21.875H15.6251M48.9584 34.375L42.2688 22.9167C42.0865 22.6009 41.8245 22.3385 41.509 22.1557C41.1935 21.9729 40.8356 21.8761 40.4709 21.875H34.3751M25.0001 1.04169V23.9584M25.0001 1.04169L16.6667 9.37502M25.0001 1.04169L33.3334 9.37502"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const TrashPicto: React.FC = () => (
    <svg width="47" height="51" viewBox="0 0 47 51" fill="none">
        <path
            d="M41.5834 12.4167H6.16675L7.91467 3.66667C8.01079 3.19575 8.26679 2.77255 8.63926 2.4688C9.01174 2.16504 9.47779 1.99942 9.95842 2H37.7918C38.2724 1.99942 38.7384 2.16504 39.1109 2.4688C39.4834 2.77255 39.7394 3.19575 39.8355 3.66667L41.5834 12.4167Z"
            fill="#C9F7CA"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M36.375 12.4167H11.375L12.4167 6.16667H35.3333L36.375 12.4167Z"
            fill="#6B6B6B"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M37.6438 48.0917C37.5809 48.5954 37.3361 49.0589 36.9556 49.3949C36.575 49.731 36.0849 49.9165 35.5772 49.9167H11.1897C10.6691 49.9189 10.1666 49.7262 9.781 49.3765C9.39542 49.0268 9.15474 48.5454 9.10633 48.0271L6.16675 16.5833H41.5834L37.6438 48.0917Z"
            fill="#C9F7CA"
        />
        <path
            d="M40.5876 24.55L41.5834 16.5833H6.16675L6.91466 24.55H40.5876Z"
            fill="#78EB7B"
        />
        <path
            d="M45.75 14.5C45.75 15.0525 45.5305 15.5824 45.1398 15.9731C44.7491 16.3638 44.2192 16.5833 43.6667 16.5833H4.08333C3.5308 16.5833 3.00089 16.3638 2.61019 15.9731C2.21949 15.5824 2 15.0525 2 14.5C2 13.9475 2.21949 13.4176 2.61019 13.0269C3.00089 12.6362 3.5308 12.4167 4.08333 12.4167H43.6667C44.2192 12.4167 44.7491 12.6362 45.1398 13.0269C45.5305 13.4176 45.75 13.9475 45.75 14.5Z"
            fill="#C9F7CA"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M37.6438 48.0917C37.5809 48.5954 37.3361 49.0589 36.9556 49.3949C36.575 49.731 36.0849 49.9165 35.5772 49.9167H11.1897C10.6691 49.9189 10.1666 49.7262 9.781 49.3765C9.39542 49.0268 9.15474 48.5454 9.10633 48.0271L6.16675 16.5833H41.5834L37.6438 48.0917Z"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.1833 34.5937L17.6937 31.4187L13.9458 32.2229"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.5001 39.4625H15.9272C15.6308 39.4641 15.3394 39.3872 15.0823 39.2397C14.8253 39.0922 14.6119 38.8793 14.4638 38.6226C14.3157 38.366 14.2381 38.0747 14.239 37.7784C14.2399 37.482 14.3192 37.1912 14.4688 36.9354L17.6855 31.4187M27.248 36.8792L24.9834 39.6875L27.248 42.8187"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M30.6353 33.3896L32.8332 37.1937C32.9806 37.4495 33.0581 37.7395 33.0579 38.0347C33.0576 38.3298 32.9797 38.6197 32.8319 38.8752C32.6841 39.1307 32.4716 39.3428 32.2159 39.4901C31.9601 39.6375 31.6701 39.7149 31.3749 39.7146L24.9895 39.6875M24.7437 28.8729L28.4978 29.2396L30.1062 26.1417"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M20.3979 27.1833L22.4167 23.6896C22.5635 23.4324 22.7757 23.2186 23.0319 23.0698C23.288 22.9211 23.5789 22.8428 23.875 22.8428C24.1712 22.8428 24.4621 22.9211 24.7182 23.0698C24.9743 23.2186 25.1866 23.4324 25.3334 23.6896L28.5 29.2333"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const FolderPicto: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
    >
        <g clipPath="url(#clip0_160_947)">
            <path
                d="M48.9584 32.2917L47.2105 23.5417C47.1144 23.0707 46.8584 22.6476 46.4859 22.3438C46.1134 22.04 45.6474 21.8744 45.1667 21.875H4.83341C4.35279 21.8744 3.88674 22.04 3.51426 22.3438C3.14178 22.6476 2.88579 23.0707 2.78966 23.5417L1.04175 32.2917V40.625H48.9584V32.2917Z"
                fill="#C9C9FC"
                stroke="#00303E"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M42.7084 37.5V11.4583H23.0376C22.3651 11.4807 21.7006 11.3076 21.1245 10.96C20.5484 10.6125 20.0855 10.1053 19.7917 9.49999C19.5144 8.84526 19.0503 8.2867 18.4576 7.89398C17.8648 7.50127 17.1695 7.29178 16.4584 7.29166H8.33341C8.05715 7.29166 7.7922 7.4014 7.59685 7.59675C7.40149 7.7921 7.29175 8.05706 7.29175 8.33332V37.5"
                fill="#C9C9FC"
            />
            <path
                d="M23.0376 11.4583C22.3651 11.4807 21.7006 11.3076 21.1245 10.96C20.5484 10.6125 20.0855 10.1053 19.7917 9.49999C19.5144 8.84526 19.0503 8.2867 18.4576 7.89398C17.8648 7.50127 17.1695 7.29178 16.4584 7.29166H8.33341C8.05715 7.29166 7.7922 7.4014 7.59685 7.59675C7.40149 7.7921 7.29175 8.05706 7.29175 8.33332V37.5H9.75008L35.7917 11.4583H23.0376Z"
                fill="#E5E5F4"
            />
            <path
                d="M42.7084 28.125V11.4583H23.0376C22.3651 11.4807 21.7006 11.3076 21.1245 10.96C20.5484 10.6125 20.0855 10.1053 19.7917 9.49999C19.5144 8.84526 19.0503 8.2867 18.4576 7.89398C17.8648 7.50127 17.1695 7.29178 16.4584 7.29166H8.33341C8.05715 7.29166 7.7922 7.4014 7.59685 7.59675C7.40149 7.7921 7.29175 8.05706 7.29175 8.33332V28.125"
                stroke="#00303E"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M38.5418 7.29167H25.0918C24.4038 7.2916 23.7301 7.09564 23.1494 6.7267C22.5687 6.35777 22.105 5.83111 21.8127 5.20833C21.5205 4.58715 21.058 4.06162 20.479 3.69284C19.9001 3.32405 19.2283 3.12715 18.5418 3.125H11.4585"
                stroke="#00303E"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M25.0001 22.9167C27.0136 22.9167 28.6459 21.2844 28.6459 19.2708C28.6459 17.2573 27.0136 15.625 25.0001 15.625C22.9865 15.625 21.3542 17.2573 21.3542 19.2708C21.3542 21.2844 22.9865 22.9167 25.0001 22.9167Z"
                fill="#E5E5F4"
                stroke="#00303E"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M32.2918 30.2083C31.8787 28.5881 30.9376 27.1515 29.6172 26.1256C28.2968 25.0996 26.6723 24.5427 25.0002 24.5427C23.328 24.5427 21.7035 25.0996 20.3831 26.1256C19.0627 27.1515 18.1217 28.5881 17.7085 30.2083H32.2918Z"
                fill="#C9C9FC"
                stroke="#00303E"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M38.5417 32.2917C38.1243 32.2915 37.711 32.375 37.3263 32.5372C36.9416 32.6995 36.5933 32.9371 36.302 33.2362C36.0107 33.5353 35.7823 33.8897 35.6303 34.2785C35.4782 34.6673 35.4056 35.0827 35.4167 35.5C35.3885 36.3337 35.0306 37.1222 34.4217 37.6924C33.8128 38.2627 33.0026 38.5681 32.1688 38.5417H17.8292C16.9958 38.5675 16.1861 38.2618 15.5777 37.6917C14.9692 37.1215 14.6117 36.3334 14.5834 35.5C14.5945 35.0827 14.5219 34.6673 14.3699 34.2785C14.2178 33.8897 13.9894 33.5353 13.6981 33.2362C13.4068 32.9371 13.0585 32.6995 12.6739 32.5372C12.2892 32.375 11.8759 32.2915 11.4584 32.2917H1.04175V44.7917C1.04175 45.3442 1.26124 45.8741 1.65194 46.2648C2.04264 46.6555 2.57255 46.875 3.12508 46.875H46.8751C47.4276 46.875 47.9575 46.6555 48.3482 46.2648C48.7389 45.8741 48.9584 45.3442 48.9584 44.7917V32.2917H38.5417Z"
                fill="#C9C9FC"
                stroke="#00303E"
                strokeWidth="2.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_160_947">
                <rect width="50" height="50" fill="white" />
            </clipPath>
        </defs>{" "}
    </svg>
);

export const ExtremeDatePicto: React.FC = () => (
    <svg
        width="50"
        height="51"
        viewBox="0 0 50 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1.04175 15.625V7.29168C1.04175 6.73914 1.26124 6.20924 1.65194 5.81854C2.04264 5.42784 2.57255 5.20834 3.12508 5.20834H46.8751C47.4276 5.20834 47.9575 5.42784 48.3482 5.81854C48.7389 6.20924 48.9584 6.73914 48.9584 7.29168V15.625H1.04175Z"
            fill="#FF808C"
        />
        <path
            d="M1.04175 10.4167V7.29168C1.04175 6.73914 1.26124 6.20924 1.65194 5.81854C2.04264 5.42784 2.57255 5.20834 3.12508 5.20834H46.8751C47.4276 5.20834 47.9575 5.42784 48.3482 5.81854C48.7389 6.20924 48.9584 6.73914 48.9584 7.29168V10.4167H1.04175Z"
            fill="#FFBFC5"
        />
        <path
            d="M1.04175 15.625H48.9584V46.875C48.9584 47.4275 48.7389 47.9575 48.3482 48.3482C47.9575 48.7389 47.4276 48.9583 46.8751 48.9583H3.12508C2.57255 48.9583 2.04264 48.7389 1.65194 48.3482C1.26124 47.9575 1.04175 47.4275 1.04175 46.875V15.625Z"
            fill="white"
        />
        <path
            d="M46.8751 5.21043H3.12508C1.97449 5.21043 1.04175 6.14317 1.04175 7.29377V46.8771C1.04175 48.0277 1.97449 48.9604 3.12508 48.9604H46.8751C48.0257 48.9604 48.9584 48.0277 48.9584 46.8771V7.29377C48.9584 6.14317 48.0257 5.21043 46.8751 5.21043Z"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1.04175 15.6271H48.9584M11.4584 1.04376V11.4604V1.04376ZM38.5418 1.04376V11.4604V1.04376Z"
            stroke="#191919"
            strokeWidth="2.08333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const CogPicto: React.FC = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            x="0px"
            y="0px"
            viewBox="0 0 1000 1000"
            enableBackground="new 0 0 1000 1000"
            xmlSpace="preserve"
        >
            <g>
                <path d="M903.7,594c-51.4-89.1-20.5-203.2,69-255l-96.3-166.8c-27.5,16.1-59.5,25.4-93.7,25.4c-102.9,0-186.3-84-186.3-187.5H403.8c0.2,32-7.7,64.4-24.9,94c-51.4,89.1-165.7,119.3-255.4,67.7L27.3,338.5C55,354.3,79,377.4,96.1,407c51.3,88.9,20.6,202.8-68.6,254.8l96.3,166.8c27.4-16,59.2-25.1,93.2-25.1c102.6,0,185.8,83.4,186.3,186.6h192.6c-0.1-31.7,7.9-63.7,24.9-93c51.3-88.9,165.4-119.3,255-68l96.3-166.8C944.5,646.4,920.7,623.4,903.7,594L903.7,594z M500.1,698.5c-109.6,0-198.4-88.8-198.4-198.5c0-109.6,88.8-198.4,198.4-198.4c109.6,0,198.5,88.8,198.5,198.4C698.5,609.6,609.7,698.5,500.1,698.5z" />
            </g>
        </svg>
    );
};
