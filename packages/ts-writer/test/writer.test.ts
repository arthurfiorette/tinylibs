import { TsWriter } from '../src';

describe(TsWriter, () => {
  let w: TsWriter;

  beforeEach(() => {
    w = new TsWriter({});
  });

  it('writes hello world', () => {
    w.write`${{ filename: 'hello-world.ts' }}

    console.log('hello world')
    
    `;

    const result = w.transpile();

    expect(result['hello-world.js']).toBe(`console.log('hello world');\n`);
    expect(result['hello-world.d.ts']).toHaveLength(0);
  });

  it('writes hello world two times', () => {
    w.write`${{ filename: 'hello-world.ts' }}

    console.log('hello world')
    
    `;

    w.write`${{ filename: 'hello-world.ts' }}

    console.log('hello world')
    
    `;

    const result = w.transpile();

    expect(result['hello-world.js']).toBe(
      "console.log('hello world');\nconsole.log('hello world');\n"
    );
    expect(result['hello-world.d.ts']).toHaveLength(0);
  });

  it('writes a function per file', () => {
    w.write`${{ filename: 'a.ts' }} function a(b: number) { return b * 2 }`;
    w.write`${{ filename: 'b.ts' }} function b(c: number) { return c * 2 }`;

    const result = w.transpile();

    expect(result['a.js']).toBe(`function a(b) { return b * 2; }\n`);
    expect(result['a.d.ts']).toBe(`declare function a(b: number): number;\n`);
    expect(result['b.js']).toBe(`function b(c) { return c * 2; }\n`);
    expect(result['b.d.ts']).toBe(`declare function b(c: number): number;\n`);
  });

  it('writes unique texts', () => {
    w.writeUnique`${{ filename: 'a.ts' }} function a(b: number) { return b * 2 }`;
    w.writeUnique`${{ filename: 'a.ts' }} function a(b: number) { return b * 2 }`;

    const result = w.transpile();

    expect(result['a.js']).toBe(`function a(b) { return b * 2; }\n`);
    expect(result['a.d.ts']).toBe(`declare function a(b: number): number;\n`);
  });

  it('writes unique texts with different data', () => {
    w.writeUnique`${{ filename: 'a.ts' }} function a(b: number) { return b * 2 }`;
    w.writeUnique`${{ filename: 'a.ts' }} function b(b: number) { return b * 2 }`;

    const result = w.transpile();

    expect(result['a.js']).toBe(
      `function a(b) { return b * 2; }\nfunction b(b) { return b * 2; }\n`
    );
    expect(result['a.d.ts']).toBe(
      `declare function a(b: number): number;\ndeclare function b(b: number): number;\n`
    );
  });

  it('writes with head', () => {
    w.write`${{ filename: 'a.ts' }} function a(b: number) { return b * 2 }`;
    w.head`${{ filename: 'a.ts' }} function b(c: number) { return c * 2 }`;

    const result = w.transpile();

    expect(result['a.js']).toBe(
      `function b(c) { return c * 2; }\nfunction a(b) { return b * 2; }\n`
    );
    expect(result['a.d.ts']).toBe(
      `declare function b(c: number): number;\ndeclare function a(b: number): number;\n`
    );
  });

  it('writes with head and unique', () => {
    w.write`${{ filename: 'a.ts' }} function a(b: number) { return b * 2 }`;
    w.headUnique`${{ filename: 'a.ts' }} function b(c: number) { return c * 2 }`;
    w.headUnique`${{ filename: 'a.ts' }} function b(c: number) { return c * 2 }`;

    const result = w.transpile();

    expect(result['a.js']).toBe(
      `function b(c) { return c * 2; }\nfunction a(b) { return b * 2; }\n`
    );
    expect(result['a.d.ts']).toBe(
      `declare function b(c: number): number;\ndeclare function a(b: number): number;\n`
    );
  });

  it('writes with clean = false', () => {
    w.write`${{ filename: 'a.ts' }} function a(b: number) { return b * 2 }`;
    w.head`${{ filename: 'a.ts' }} function b(c: number) { return c * 2 }`;

    const result = w.transpile();

    expect(result['a.js']).toBe(
      `function b(c) { return c * 2; }\nfunction a(b) { return b * 2; }\n`
    );
    expect(result['a.d.ts']).toBe(
      `declare function b(c: number): number;\ndeclare function a(b: number): number;\n`
    );

    w.write`${{ filename: 'b.ts' }} function c(d: number) { return d * 2 }`;
    w.head`${{ filename: 'b.ts' }} function e(f: number) { return f * 2 }`;

    w.transpile();

    expect(result['a.js']).toBe(
      `function b(c) { return c * 2; }\nfunction a(b) { return b * 2; }\n`
    );
    expect(result['a.d.ts']).toBe(
      `declare function b(c: number): number;\ndeclare function a(b: number): number;\n`
    );
    expect(result['b.js']).toBe(
      `function e(f) { return f * 2; }\nfunction c(d) { return d * 2; }\n`
    );
    expect(result['b.d.ts']).toBe(
      `declare function e(f: number): number;\ndeclare function c(d: number): number;\n`
    );
  });
});
