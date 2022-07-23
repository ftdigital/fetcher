import { HttpMethod } from "@types";

export interface FetchOptions {
  prefixUrl?: string;
  headers?: HeadersInit;
  searchParams?: URLSearchParams;
  method?: HttpMethod;
  body?: BodyInit | null | undefined;
}
