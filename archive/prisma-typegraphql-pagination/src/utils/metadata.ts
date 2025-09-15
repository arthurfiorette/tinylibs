import { getMetadataStorage } from 'type-graphql';
import type { EnumMetadata, FieldMetadata } from 'type-graphql/dist/metadata/definitions';

export const findEnumMetadata = (name: string): EnumMetadata | undefined => {
  const metadata = getMetadataStorage();
  return metadata.enums.find((e) => e.name === name);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const findMetadataFields = (target: Function) => {
  const metadata = getMetadataStorage();
  return metadata.fields.filter((field) => field.target === target);
};

export const findFieldMetadata = (
  allFields: FieldMetadata[],
  fieldName: string,
  entityName: string
) => {
  const field = allFields.find((f) => f.name === fieldName);

  if (!field) {
    throw new Error(
      `${String(
        fieldName
      )} was specified as unique field, but it was not found (at least not for type-graphql) in the ${entityName} entity. Did you forget to use @Field() on it?`
    );
  }

  return field;
};
