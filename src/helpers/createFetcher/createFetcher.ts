import { Fetch, FetchOptions } from "@classes/Fetch";
import { HttpMethod, ResponsePromise } from "@types";
import { Fetcher } from "./createFetcher.types";

const REQUEST_METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "HEAD",
  "DELETE",
];

export function createFetcher(defaults?: FetchOptions) {
  const create = (newDefaults: FetchOptions) =>
    createFetcher({ ...defaults, ...newDefaults });

  const extend = (newDefaults?: FetchOptions) =>
    createFetcher({ ...defaults, ...newDefaults });

  const methods = Object.fromEntries(
    REQUEST_METHODS.map((method) => [
      method.toLowerCase() as any,
      (requestInfo: RequestInfo, options?: FetchOptions) =>
        Fetch.create(requestInfo, {
          ...defaults,
          ...options,
          method,
        }),
    ])
  ) as Record<
    Lowercase<HttpMethod>,
    (requestInfo: RequestInfo, options?: FetchOptions) => ResponsePromise
  >;

  const instance: Fetcher = Object.assign(
    { ...methods, create, extend },
    (requestInfo: RequestInfo, options?: FetchOptions) =>
      Fetch.create(requestInfo, {
        ...defaults,
        ...options,
      })
  );

  return instance;
}
