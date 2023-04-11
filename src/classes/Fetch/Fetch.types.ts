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

export interface FetchOptions extends RequestInit {
  prefixUrl?: string;
  searchParams?: URLSearchParams;
  method?: HttpMethod;
  throwHttpErrors?: boolean;
  hooks?: {
    beforeRequest?: BeforeRequestHook[];
    beforeRetry?: BeforeRetryHook[];
    beforeError?: BeforeErrorHook[];
    afterResponse?: AfterResponseHook[];
  };
}

export type Input = string | URL | Request;
