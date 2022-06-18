import { FetcherOptions } from "../Fetcher";
import { HttpMethod, ResponsePromise } from "../types";

export interface FetcherInstance
  extends Record<
    Lowercase<HttpMethod>,
    (requestInfo: RequestInfo, options?: FetcherOptions) => ResponsePromise
  > {
  (requestInfo: RequestInfo, options?: FetcherOptions): ResponsePromise;
  create: (options: FetcherOptions) => FetcherInstance;
  extend: (options?: FetcherOptions) => FetcherInstance;
}
