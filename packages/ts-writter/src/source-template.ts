/** A simple class that extends string to allow for runtime checking of generated strings */
export class SourceTemplate extends String {
  /** @internal */
  __source_template__ = true;

  constructor(code: string) {
    super(code.trim());
  }

  /** Checks if the provided string was created from a sour */
  static match(this: void, str: unknown): str is SourceTemplate {
    return (str as SourceTemplate).__source_template__ === true;
  }
}
