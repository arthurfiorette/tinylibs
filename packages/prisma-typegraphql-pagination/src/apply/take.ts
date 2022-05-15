import { __decorate } from 'tslib';
import { Field } from 'type-graphql';
import type { InstanceType, Pageable } from '../utils/types';
import { ValidateIfPresent } from '../utils/validator';

export function applyTake<T extends InstanceType>(
  entity: Pageable<T>,
  paginator: Function,
  takeLimit: number
) {
  __decorate(
    [
      ValidateIfPresent((c) => [c.Min(0), c.Max(takeLimit), c.IsOptional(), c.IsNumber()]),
    Field(() => Number, {
      nullable: true,
      name: 'take',
      description: `Take \`±n\` ${entity.name.toLowerCase()}s from the position of the cursor.`,
      simple: true
    })
    ],
    paginator.prototype,
    'take'
  );
}
