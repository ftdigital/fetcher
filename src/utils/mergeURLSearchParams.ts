export function mergeURLSearchParams(
  ...urlSearchParamsInstances: (URLSearchParams | undefined)[]
) {
  let result: URLSearchParams = new URLSearchParams();

  for (const urlSearchParams of urlSearchParamsInstances) {
    if (urlSearchParams) {
      Array.from(urlSearchParams.entries()).forEach(([key, value]) =>
        result.append(key, value)
      );
    }
  }

  return result;
}
