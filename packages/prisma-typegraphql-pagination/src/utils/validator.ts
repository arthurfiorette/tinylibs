import * as ClassValidator from 'class-validator';
import { __decorate } from 'tslib';
import type { MethodAndPropDecorator } from 'type-graphql/dist/decorators/types';

/** Decorate these properties if `class-validator` is present at runtime. */
export const ValidateIfPresent = (
  cb: (a: typeof ClassValidator) => MethodAndPropDecorator[]
): PropertyDecorator => {
  return (target, key) => {
    // Class validator is available
    if (ClassValidator) {
      __decorate(cb(ClassValidator), target, key);
    }
  };
};

export const createSingleFieldValidator = (
  c: typeof ClassValidator,
  entityName: string
) => {
  // Custom validator.
  // Prisma only allows one field per cursor object.
  // [{id: '1'}, {name: 'Arthur'}] is allowed.
  // [{id: '1', name: 'Arthur'}] is NOT allowed.

  return c.ValidateBy({
    name: 'single-field',
    validator: {
      validate: (_, opts) => {
        return (
          !!opts?.value &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Object.values(opts.value).filter((v) => !!v).length === 1
        );
      },

      defaultMessage: c.buildMessage(
        (eachPrefix) => eachPrefix + `${entityName} must contain only one field.`
      )
    }
  });
};
