export interface AdvSearchField {
    itemid: string;
    caption: string;
    datatype: string;
}

export interface AdvSearchOption {
    value: string;
    caption: string;
}

export interface AdvSearchRow {
    key: string;
    itemid: string;
    datatype: string;
    condition: string;
    t1: string;
    t2: string;
    t3: string;
}

export const SINGLE_VALUE_TYPES = new Set(['string', 'numeric', 'date', 'simplesearch']);

export const DEFAULT_CONDITIONS: Record<string, AdvSearchOption[]> = {
    string: [
        { value: 'contains', caption: 'adv_search.contains' },
        { value: 'eq', caption: 'adv_search.equals' },
        { value: 'startswith', caption: 'adv_search.starts_with' },
        { value: 'endswith', caption: 'adv_search.ends_with' },
    ],
    numeric: [
        { value: 'eq', caption: 'adv_search.equals' },
        { value: 'gt', caption: 'adv_search.greater_than' },
        { value: 'lt', caption: 'adv_search.less_than' },
        { value: 'gte', caption: 'adv_search.greater_or_equal' },
        { value: 'lte', caption: 'adv_search.less_or_equal' },
        { value: 'between', caption: 'adv_search.between' },
    ],
    date: [
        { value: 'eq', caption: 'adv_search.equals' },
        { value: 'gt', caption: 'adv_search.greater_than' },
        { value: 'lt', caption: 'adv_search.less_than' },
        { value: 'gte', caption: 'adv_search.greater_or_equal' },
        { value: 'lte', caption: 'adv_search.less_or_equal' },
        { value: 'between', caption: 'adv_search.between' },
    ],
};