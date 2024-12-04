/** Error thrown when attempting to add a key that already exists in a map. */
export class KeyAlreadyExistsError extends Error {
  constructor(readonly key: string) {
    super(`Key ${key} already exists in map`);
  }
}

/** Error thrown when attempting to add a value that already exists in a map. */
export class ValueAlreadyExistsError extends Error {
  constructor(readonly value: string | number) {
    super(`Value ${value} already exists in map`);
  }
}
