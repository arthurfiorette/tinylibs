import { __decorate, __metadata } from 'tslib';
import { Field } from 'type-graphql';
import { createEntityFieldsType } from '../create/fields-enum';
import type { InstanceType, Pageable } from '../utils/types';
import { ValidateIfPresent } from '../utils/validator';

export function applyDistinct<T extends InstanceType>(
  entity: Pageable<T>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  paginator: Function,
  fieldNames: string[]
) {
  const EntityFieldsType = createEntityFieldsType<T>(entity, fieldNames);

  __decorate(
    [
      ValidateIfPresent((c) => [c.IsOptional(), c.MinLength(0, { each: true })]),
      Field(() => [EntityFieldsType], {
        nullable: true,
        name: 'distinct',
        description: `Filter by unique combinations of ${entity.name.toLowerCase()}s.`,
        simple: true
      }),
      __metadata('design:type', EntityFieldsType)
    ],
    paginator.prototype,
    'distinct'
  );
}
