import type { FetchOptions } from "@classes/Fetch";
import { mergeHeaders } from "./mergeHeaders";
import { mergeURLSearchParams } from "./mergeURLSearchParams";

export function mergeOptions(
  ...optionsArr: (FetchOptions | undefined)[]
): FetchOptions {
  let result: FetchOptions = {};

  for (const options of optionsArr) {
    if (options) {
      result = {
        ...result,
        ...options,
        searchParams: mergeURLSearchParams(
          result.searchParams,
          options.searchParams
        ),
        headers: mergeHeaders(result.headers, options.headers),
      };
    }
  }

  return result;
}
