import { __decorate } from 'tslib';
import { Field } from 'type-graphql';
import type { InstanceType, Pageable } from '../utils/types';
import { ValidateIfPresent } from '../utils/validator';

export function applySkip<T extends InstanceType>(
  entity: Pageable<T>,
  paginator: Function
) {
  __decorate(
    [
      ValidateIfPresent((c) => [c.Min(0), c.IsOptional(), c.IsNumber()]),
      Field(() => Number, {
        nullable: true,
        name: 'skip',
        description: `Skips the first \`n\` ${entity.name.toLowerCase()}s.`,
        simple: true
      })
    ],
    paginator.prototype,
    'skip'
  );
}
