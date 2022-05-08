import { __decorate, __metadata } from 'tslib';
import { Field, InputType } from 'type-graphql';
import { SortOrder } from '../asc-desc';
import { orderByName } from '../utils/names';
import type { Constructor, InstanceType, Pageable } from '../utils/types';
import { ValidateIfPresent } from '../utils/validator';

export type OrderBy<T extends InstanceType> = Record<keyof T, SortOrder>;

export const createOrderBy = <T extends InstanceType>(
  entity: Pageable<T>,
  fieldNames: string[]
): Constructor<OrderBy<T>> => {
  const nameOfOrderBy = orderByName(entity.name);

  @InputType(nameOfOrderBy, {
    description: `Determine the order of ${entity.name.toLowerCase()}s to fetch.`
  })
  class OrderByImpl {}

  for (const field of fieldNames) {
    //@ts-expect-error Initializing the field with a undefined value.
    // This makes Object.values(OrderByImpl) return a non-empty array.
    OrderByImpl.prototype[field] = undefined;

    __decorate(
      [
        ValidateIfPresent((c) => [c.IsIn(Object.keys(SortOrder))]),
        Field(() => SortOrder, { nullable: true, name: field, simple: true }),
        // Prisma.AscDesc is string at runtime (kind of a string union of each enum value)
        __metadata('design:type', String)
      ],
      OrderByImpl.prototype,
      field
    );
  }

  return OrderByImpl as Constructor<OrderBy<T>>;
};
