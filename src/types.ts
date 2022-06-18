export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "HEAD" | "DELETE";

export interface ResponsePromise extends Promise<Response> {
  json: <T = unknown>() => Promise<T>;
}
