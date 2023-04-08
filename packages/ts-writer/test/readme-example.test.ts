/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { t } from '../src';

it('runs the readme example', () => {
  expect(t`${{
    some: 'data',
    deep: { property: 'property value' },
    condition: true,
    numbers: [[1], [2], [3], [4], [5]],
    func: () => 'return',
    b: class {
      public num = 1;
    }
  }}

(All spaces before the first non-space character gets trimmed out)

Anything inside here already is part of the template.

---

You can use ${'some'} to access the data.
NOTE: You can ONLY pass string properties of the first argument,
you shall use the dot notation to access deeper properties.
${'deep.property'} will access the value 'property value'.

---

You can also use \${['command', ...arguments]} syntax to execute commands.
Currently, there are only 2 commands: if and each.

${['if', 'condition']}
  This will only be in the generated string if the 'condition' property is truthy.
${['/if']}

${['each', 'numbers']}
  This will be repeated for each item in the 'numbers' array.
  You can access the current item with ${'numbers.@'} notation.

  ${['each', 'numbers.@']}
    ${'numbers.@.@'} accesses the current (deep) item.
  ${['/each']}
${['/each']}

---

Everything gets stringified by the 'javascript-stringify' package, so you can
pass everything as a parameter. Like classes and functions!

${'func'} will serialize into '() => "return"'.
and ${'b'} will serialize into 'class { num = 1 }'.

NOTE: Types are not preserved for runtime variables, so you must use this
feature with caution.

(All spaces after the last non-space character gets trimmed out)

`).toBe(
    '(All spaces before the first non-space character gets trimmed out)\n' +
      '\n' +
      'Anything inside here already is part of the template.\n' +
      '\n' +
      '---\n' +
      '\n' +
      "You can use 'data' to access the data.\n" +
      'NOTE: You can ONLY pass string properties of the first argument,\n' +
      'you shall use the dot notation to access deeper properties.\n' +
      "'property value' will access the value 'property value'.\n" +
      '\n' +
      '---\n' +
      '\n' +
      "You can also use ${['command', ...arguments]} syntax to execute commands.\n" +
      'Currently, there are only 2 commands: if and each.\n' +
      '\n' +
      '\n' +
      "  This will only be in the generated string if the 'condition' property is truthy.\n" +
      '\n' +
      '\n' +
      '\n' +
      "  This will be repeated for each item in the 'numbers' array.\n" +
      '  You can access the current item with [1] notation.\n' +
      '\n' +
      '  \n' +
      '    1 accesses the current (deep) item.\n' +
      '  \n' +
      '\n' +
      "  This will be repeated for each item in the 'numbers' array.\n" +
      '  You can access the current item with [2] notation.\n' +
      '\n' +
      '  \n' +
      '    2 accesses the current (deep) item.\n' +
      '  \n' +
      '\n' +
      "  This will be repeated for each item in the 'numbers' array.\n" +
      '  You can access the current item with [3] notation.\n' +
      '\n' +
      '  \n' +
      '    3 accesses the current (deep) item.\n' +
      '  \n' +
      '\n' +
      "  This will be repeated for each item in the 'numbers' array.\n" +
      '  You can access the current item with [4] notation.\n' +
      '\n' +
      '  \n' +
      '    4 accesses the current (deep) item.\n' +
      '  \n' +
      '\n' +
      "  This will be repeated for each item in the 'numbers' array.\n" +
      '  You can access the current item with [5] notation.\n' +
      '\n' +
      '  \n' +
      '    5 accesses the current (deep) item.\n' +
      '  \n' +
      '\n' +
      '\n' +
      '---\n' +
      '\n' +
      "Everything gets stringified by the 'javascript-stringify' package, so you can\n" +
      'pass everything as a parameter. Like classes and functions!\n' +
      '\n' +
      `() => 'return' will serialize into '() => "return"'.\n` +
      'and class {\n' +
      '    num = 1;\n' +
      "} will serialize into 'class { num = 1 }'.\n" +
      '\n' +
      'NOTE: Types are not preserved for runtime variables, so you must use this\n' +
      'feature with caution.\n' +
      '\n' +
      '(All spaces after the last non-space character gets trimmed out)'
  );
});
