import type { HTTPError } from "@classes/HTTPError";
import type { HttpMethod } from "@types";

export type BeforeRequestHook = (
  request: Request,
  options: FetchOptions
) => Request | Response | void | Promise<Request | Response | void>;

type BeforeRetryHook = (request: Request) => void;

export type BeforeErrorHook = (
  error: HTTPError
) => HTTPError | Promise<HTTPError>;

export type AfterResponseHook = (
  request: Request,
  options: FetchOptions,
  response: Response
) => Response | void | Promise<Response | void>;

interface Hooks {
  beforeRequest?: BeforeRequestHook[];
  beforeRetry?: BeforeRetryHook[];
  beforeError?: BeforeErrorHook[];
  afterResponse?: AfterResponseHook[];
}
export interface FetchOptions extends RequestInit {
  prefixUrl?: string;
  searchParams?: URLSearchParams;
  method?: HttpMethod;
  throwHttpErrors?: boolean;
  fetch?: (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ) => Promise<Response>;
  hooks?: Hooks;
}

export type InternalFetchOptions = Omit<FetchOptions, "prefixUrl"> &
  Required<Pick<FetchOptions, "prefixUrl">>;

export type Input = string | URL | Request;
