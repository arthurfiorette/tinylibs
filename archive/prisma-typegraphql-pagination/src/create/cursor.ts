import { __decorate, __metadata } from 'tslib';
import { Field, InputType } from 'type-graphql';
import type { FieldMetadata } from 'type-graphql/dist/metadata/definitions';
import { findFieldMetadata } from '../utils/metadata';
import { cursorName } from '../utils/names';
import type { Constructor, InstanceType, Pageable } from '../utils/types';

export type Cursor<T extends InstanceType, K extends (keyof T)[]> = Pick<T, K[number]>;

export const createCursor = <T extends InstanceType, K extends (keyof T & string)[]>(
  entity: Pageable<T>,
  fieldMetadataArr: FieldMetadata[],
  uniqueFields: K
): Constructor<Cursor<T, K>> => {
  const className = cursorName(entity.name);

  @InputType(className, {
    description: `Sets the position for listing ${entity.name.toLowerCase()}s`
  })
  class CursorImpl {}

  for (const field of uniqueFields) {
    //@ts-expect-error Initializing the field with a undefined value.
    // This makes Object.values(CursorImpl) return a non-empty array.
    CursorImpl.prototype[field] = undefined;

    const metadata = findFieldMetadata(fieldMetadataArr, field, entity.name);
    const FieldType = metadata.getType();

    __decorate(
      [
        Field(() => FieldType, { nullable: true, name: field, simple: true }),
        __metadata('design:type', FieldType)
      ],
      CursorImpl.prototype,
      field
    );
  }

  return CursorImpl as Constructor<Cursor<T, K>>;
};
