export type TableAlign = 'left' | 'center' | 'right';

export interface TableColumn<T = Record<string, unknown>> {
    key: string;
    header: string;
    width?: string;
    align?: TableAlign;
    value?: (row: T) => string | number | null | undefined;
}