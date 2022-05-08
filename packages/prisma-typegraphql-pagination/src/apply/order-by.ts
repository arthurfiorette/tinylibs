import { __decorate, __metadata } from 'tslib';
import { Field } from 'type-graphql';
import { createOrderBy } from '../create/order-by';
import type { InstanceType, Pageable } from '../utils/types';
import { ValidateIfPresent } from '../utils/validator';

export function applyOrderBy<T extends InstanceType>(
  entity: Pageable<T>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  paginator: Function,
  fieldNames: string[]
) {
  const EntityOrderBy = createOrderBy(entity, fieldNames);

  __decorate(
    [
      ValidateIfPresent((c) => [c.IsOptional(), c.ValidateNested({ each: true })]),
      Field(() => [EntityOrderBy], {
        nullable: true,
        name: 'orderBy',
        description: `Determine the order of ${entity.name.toLowerCase()}s to fetch.`,
        simple: true
      }),
      __metadata('design:type', EntityOrderBy)
    ],
    paginator.prototype,
    'orderBy'
  );
}
