/** The generic type a template can have as its input. */
export type TemplateData = Record<string, unknown>;

/** The generic type a template can have as its text used to write files */
export type SourceTemplateData = TemplateData & { filename: `${string}.${'ts' | 'tsx'}` };

/** The parameters you can provide a template with */
export type Commands<Arg extends string = string> =
  | Arg
  | [cmd: 'each', arg: Arg]
  | [cmd: '/each']
  | [cmd: 'if', arg: Arg]
  | [cmd: '/if'];

/** Returns a deep keyof for an object, joined by dots. */
export type KeysOf<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? T extends readonly unknown[]
          ? // Dollar sign is used to array indexing
            | `@`
              | Join<`@`, KeysOf<T[K], Prev[D]>>
              | `${K}`
              | Join<K, KeysOf<T[K], Prev[D]>>
          : `${K}` | Join<K, KeysOf<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : '';

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];
