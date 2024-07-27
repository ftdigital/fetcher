import { Fetch, FetchOptions } from "@classes/Fetch";
import { HttpMethod, ResponsePromise } from "@types";
import { Fetcher } from "./createFetcher.types";
import { REQUEST_METHODS } from "@constants";
import { mergeOptions } from "@utils/mergeOptions";

export function createFetcher(defaults?: FetchOptions) {
  const create = (newDefaults: FetchOptions) =>
    createFetcher(mergeOptions({ ...defaults, ...newDefaults }));

  const extend = (newDefaults?: FetchOptions) =>
    createFetcher(mergeOptions({ ...defaults, ...newDefaults }));

  const methods = Object.fromEntries(
    REQUEST_METHODS.map((method) => [
      method.toLowerCase() as any,
      (requestInfo: RequestInfo, options?: FetchOptions) =>
        Fetch.create(requestInfo, mergeOptions(defaults, options, { method })),
    ])
  ) as Record<
    Lowercase<HttpMethod>,
    (requestInfo: RequestInfo, options?: FetchOptions) => ResponsePromise
  >;

  const instance: Fetcher = Object.assign(
    { ...methods, create, extend },
    (requestInfo: RequestInfo, options?: FetchOptions) =>
      Fetch.create(requestInfo, mergeOptions(defaults, options))
  );

  return instance;
}
