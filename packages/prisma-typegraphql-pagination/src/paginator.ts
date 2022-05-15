import { ArgsType, InputType } from 'type-graphql';
import { applyCursor } from './apply/cursor';
import { applyDistinct } from './apply/distinct';
import { applyOrderBy } from './apply/order-by';
import { applySkip } from './apply/skip';
import { applyTake } from './apply/take';
import type { Cursor } from './create/cursor';
import type { FieldsEnum } from './create/fields-enum';
import type { OrderBy } from './create/order-by';
import { DefaultOptions, Options } from './options';
import { findMetadataFields as findDecoratedFields } from './utils/metadata';
import { paginatorName } from './utils/names';
import type { InstanceType, Pageable } from './utils/types';

export const createPaginator = <T extends InstanceType>(
  entity: Pageable<T>,
  opts: Partial<Options<T>> = {}
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function => {
  const { allowDistinct, allowOrderBy, takeLimit } = Object.assign(opts, DefaultOptions);

  const decoratedFields = findDecoratedFields(entity);
  const fieldNames = decoratedFields.map((f) => f.name);
  const className = paginatorName(entity.name);

  @ArgsType()
  @InputType(className, {
    description: `A findMany paginator for ${entity.name.toLowerCase()} queries.`
  })
  class PaginatorImpl {
    take?: number;
    skip?: number;
    distinct?: FieldsEnum<T>[keyof T][];
    orderBy?: OrderBy<T>[];
    cursor?: Cursor<T, (keyof T)[]>;
  }

  applyTake(entity, PaginatorImpl, takeLimit);
  applySkip(entity, PaginatorImpl);

  if (opts.cursor?.length) {
    applyCursor(entity, PaginatorImpl, opts, decoratedFields);
  }

  if (allowDistinct) {
    applyDistinct(entity, PaginatorImpl, fieldNames);
  }

  if (allowOrderBy) {
    applyOrderBy(entity, PaginatorImpl, fieldNames);
  }

  return PaginatorImpl;
};
