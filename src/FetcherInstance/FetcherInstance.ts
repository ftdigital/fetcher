import { Fetcher, FetcherOptions } from "../Fetcher";
import { HttpMethod, ResponsePromise } from "../types";
import { FetcherInstance } from "./FetcherInstance.types";

const requestMethods: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "HEAD",
  "DELETE",
];

export function createFetcherInstance(defaults?: FetcherOptions) {
  const create = (newDefaults: FetcherOptions) =>
    createFetcherInstance({ ...defaults, ...newDefaults });

  const extend = (newDefaults?: FetcherOptions) =>
    createFetcherInstance({ ...defaults, ...newDefaults });

  const methods = Object.fromEntries(
    requestMethods.map((method) => [
      method.toLowerCase() as any,
      (requestInfo: RequestInfo, options?: FetcherOptions) =>
        Fetcher.create(requestInfo, {
          ...defaults,
          ...options,
          method,
        }),
    ])
  ) as Record<
    Lowercase<HttpMethod>,
    (requestInfo: RequestInfo, options?: FetcherOptions) => ResponsePromise
  >;

  const instance: FetcherInstance = Object.assign(
    { ...methods, create, extend },
    (requestInfo: RequestInfo, options?: FetcherOptions) =>
      Fetcher.create(requestInfo, {
        ...defaults,
        ...options,
      })
  );

  return instance;
}
