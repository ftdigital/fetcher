import { FetchOptions } from "@classes/Fetch";
import { HttpMethod, ResponsePromise } from "@types";

export interface Fetcher
  extends Record<
    Lowercase<HttpMethod>,
    (requestInfo: RequestInfo, options?: FetchOptions) => ResponsePromise
  > {
  (requestInfo: RequestInfo, options?: FetchOptions): ResponsePromise;
  create: (options: FetchOptions) => Fetcher;
  extend: (options?: FetchOptions) => Fetcher;
}
