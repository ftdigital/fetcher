export function mergeHeaders(...headersInits: (HeadersInit | undefined)[]) {
  const result = new Headers();

  for (const headersInit of headersInits) {
    const header = new Headers(headersInit);

    for (const [key, value] of header.entries()) {
      result.set(key, value);
    }
  }

  return result;
}
