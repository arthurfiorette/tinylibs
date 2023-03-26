import type { TemplateData } from '../types';

/** Indexes an object using a dotted string path */
export function indexObject<R>(key: string, data: TemplateData): R {
  const keys = key.split('.');

  while (keys.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currKey = keys.shift()!;

    if (currKey === '@') {
      throw new Error(
        `Cannot use "@" as a key, have you forget to wrap it in a \${['each']}?`
      );
    }

    if (
      // Avoids `cannot use 'in' operator to search` error on primitive types
      typeof data === 'object' ? currKey in data : !!data[currKey]
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      data = data[currKey] as TemplateData;
      continue;
    }

    throw new Error(
      `Key "${currKey}" ${
        key.startsWith(currKey) ? '' : `in "${key}" `
      }does not exist inside data`
    );
  }

  return data as R;
}
