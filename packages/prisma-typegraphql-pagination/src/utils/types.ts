// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InstanceType = Record<string, any>;
export type Constructor<T> = { new (): T };
export type Pageable<T extends InstanceType> = Constructor<T>;
