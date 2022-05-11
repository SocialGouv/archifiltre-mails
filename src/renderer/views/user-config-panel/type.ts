export interface UserConfigPanelBaseProps<TElement> {
    id: string;
    label: string;
    setter: (event: React.ChangeEvent<TElement>) => void;
}
