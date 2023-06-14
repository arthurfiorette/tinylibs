// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TemplateHelper = readonly [
  name: string,
  fn: (path: string | undefined, data: unknown) => unknown
];

/** The generic type a template can have as its input. */
export interface TemplateData<
  H extends readonly TemplateHelper[] | undefined = readonly TemplateHelper[] | undefined
> {
  helpers?: H;
  [key: string]: unknown;
}

/** The generic type a template can have as its text used to write files */
export interface SourceTemplateData<H extends readonly TemplateHelper[] | undefined> {
  filename: `${string}.${'ts' | 'tsx'}`;
  helpers?: H;
  [key: string]: unknown;
}

/** The parameters you can provide a template with */
export type Commands<
  Arg extends string = string,
  T extends TemplateData = TemplateData
> =
  | Arg
  | [cmd: 'each', arg: Arg]
  | [cmd: '/each']
  | [cmd: 'if', arg: Arg]
  | [cmd: 'else']
  | [cmd: '/if']
  | (undefined extends T['helpers']
      ? void
      : [cmd: `$${Exclude<T['helpers'], undefined>[number][0]}`, args?: Arg]);

/** Returns a deep keyof for an object, joined by dots. */
export type KeysOf<
  T extends Record<string, unknown> | readonly unknown[],
  Key extends KeysOfUnion<T> = KeysOfUnion<T>
> = Key extends string | number
  ? NonNullable<T[Key]> extends Record<string, unknown> | readonly unknown[]
    ?
        | (Key & string)
        | `${CommercialArray<T, Key>}.${CommercialArray<NonNullable<T[Key]>>}`
    : `${CommercialArray<T, Key>}`
  : never;

type KeysOfUnion<T> = T extends T
  ? T extends readonly unknown[]
    ? Exclude<keyof T, keyof []>
    : keyof T
  : never;

type CommercialArray<
  T extends Record<string, unknown> | readonly unknown[],
  Key = KeysOf<T>
> = T extends readonly unknown[] ? Exclude<Key, keyof []> | '@' : Key;
