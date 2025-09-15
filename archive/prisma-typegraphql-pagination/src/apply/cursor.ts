import { __decorate, __metadata } from 'tslib';
import { Field } from 'type-graphql';
import type { FieldMetadata } from 'type-graphql/dist/metadata/definitions';
import { createCursor } from '../create/cursor';
import type { Options } from '../options';
import { cursorName } from '../utils/names';
import type { InstanceType, Pageable } from '../utils/types';
import { ValidateIfPresent, createSingleFieldValidator } from '../utils/validator';

export function applyCursor<T extends InstanceType>(
  entity: Pageable<T>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  paginator: Function,
  options: Partial<Options<T>>,
  decoratedFields: FieldMetadata[]
) {
  const EntityCursor = createCursor(entity, decoratedFields, options.cursor as string[]);
  const CursorName = cursorName(entity.name);

  __decorate(
    [
      ValidateIfPresent((c) => [
        c.IsOptional(),
        c.ValidateNested(),
        createSingleFieldValidator(c, CursorName)
      ]),
      Field(() => EntityCursor, {
        nullable: true,
        name: 'cursor',
        description: `Sets the position for listing ${entity.name.toLowerCase()}s`,
        simple: true
      }),
      __metadata('design:type', EntityCursor)
    ],
    paginator.prototype,
    'cursor'
  );
}
