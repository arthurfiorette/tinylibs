import { registerEnumType } from 'type-graphql';
import { findEnumMetadata } from '../utils/metadata';
import { fieldsEnumName } from '../utils/names';
import type { InstanceType, Pageable } from '../utils/types';

export type FieldsEnum<T extends InstanceType> = { [K in keyof T]: K };

export const createEntityFieldsType = <T extends InstanceType>(
  entity: Pageable<T>,
  detectedFields: (keyof T)[]
): FieldsEnum<T> => {
  const enumName = fieldsEnumName(entity.name);
  const existent = findEnumMetadata(enumName);

  if (existent) {
    return existent.enumObj as FieldsEnum<T>;
  }

  const Fields = detectedFields.reduce((Enum, field) => {
    Enum[field] = field;
    return Enum;
  }, {} as FieldsEnum<T>);

  registerEnumType(Fields, {
    name: enumName,
    description: `Fields of ${entity.name}`
  });

  return Fields;
};
