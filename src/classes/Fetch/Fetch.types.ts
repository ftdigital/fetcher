import { HttpMethod } from "@types";

type BeforeRequestHook = (request: Request) => void;

export interface FetchOptions {
  prefixUrl?: string;
  headers?: HeadersInit;
  searchParams?: URLSearchParams;
  method?: HttpMethod;
  redirect?: RequestRedirect;
  body?: BodyInit | null | undefined;
  hooks?: {
    beforeRequest?: BeforeRequestHook[];
  };
}
