import { HttpMethod } from "../types";

export interface FetcherOptions {
  prefixUrl?: string;
  headers?: HeadersInit;
  searchParams?: URLSearchParams;
  method?: HttpMethod;
  body?: BodyInit | null | undefined;
}
