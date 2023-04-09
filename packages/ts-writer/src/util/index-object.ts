/** Indexes an object using a dotted string path */
export function indexObject<R>(path: string, data: unknown): R {
  const paths = path.split('.');

  for (let index = 0; index < paths.length; index++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const p = paths[index]!;

    if (p === '@') {
      throw new Error(
        'Cannot use "@" as a key, have you forget to wrap it in a ${[\'each\']}?'
      );
    }

    if (
      // Avoids `cannot use 'in' operator to search` error when data is primitive
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof data === 'object' && data ? p in data : (data as never)[p]
    ) {
      data = (data as never)[p];
      continue;
    }

    throw new Error(
      `Key "${p}" ${path.startsWith(p) ? '' : `in "${path}" `}does not exist inside data`
    );
  }

  return data as R;
}
