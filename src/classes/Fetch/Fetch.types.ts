import { HttpMethod } from "@types";

type BeforeRequestHook = (request: Request) => void;

export interface FetchOptions extends RequestInit {
  prefixUrl?: string;
  searchParams?: URLSearchParams;
  method?: HttpMethod;
  hooks?: {
    beforeRequest?: BeforeRequestHook[];
  };
}
