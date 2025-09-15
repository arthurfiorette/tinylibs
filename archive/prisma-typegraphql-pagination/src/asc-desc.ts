import { registerEnumType } from 'type-graphql';

export type SortOrder = 'asc' | 'desc';
export const SortOrder = Object.freeze({ asc: 'asc', desc: 'desc' });

registerEnumType(SortOrder, { name: 'PaginationSortOrder' });
