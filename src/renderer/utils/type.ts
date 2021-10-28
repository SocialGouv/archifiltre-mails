export interface CardProps {
    type: string;
    opener?: () => void;
}

export interface CardItemProps {
    opener?: () => void;
}

export type CardItemSimpleProps = CardItemProps & {
    opener?: () => void;
};
export type CardItemDoubleProps = CardItemProps & {
    content?: string;
};
export type CardItemFullProps = CardItemProps & {
    content?: string;
};
