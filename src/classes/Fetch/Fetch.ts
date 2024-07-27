import { ResponsePromise } from "@types";
import { mergeHeaders } from "@utils/mergeHeaders";
import { HTTPError } from "../HTTPError";
import { FetchOptions, Input, InternalFetchOptions } from "./Fetch.types";

export class Fetch {
  input: Input;
  options: InternalFetchOptions;
  request: Request;

  constructor(input: Input, options?: FetchOptions) {
    this.input = input;

    this.options = {
      prefixUrl: String(options?.prefixUrl ?? ""),
      throwHttpErrors: true,
      ...options,
    };

    if (this.options.prefixUrl && typeof this.input === "string") {
      if (this.input.startsWith("/")) {
        throw new Error(
          "`input` must not begin with a slash when using `prefixUrl`"
        );
      }

      if (!this.options.prefixUrl.endsWith("/")) {
        this.options.prefixUrl += "/";
      }

      this.input = this.options.prefixUrl + this.input;
    }

    if (this.options.searchParams) {
      this.input = this.input
        .toString()
        .replace(
          /(?:\?.*?)?(?=#|$)/,
          "?" + this.options.searchParams.toString()
        );
    }

    this.request = new globalThis.Request(this.input, this.options);
  }

  private async fetch(): Promise<Response> {
    for (const hook of this.options.hooks?.beforeRequest ?? []) {
      const result = hook(this.request, this.options);

      if (result instanceof Request) {
        this.request = new globalThis.Request(result, this.options);
        break;
      }

      if (result instanceof Response) {
        return result;
      }
    }

    const options: InternalFetchOptions = {
      ...this.options,
      headers: mergeHeaders(this.options.headers, this.request.headers),
    };

    return fetch(this.request.clone(), options);
  }

  private createResponsePromise(): ResponsePromise {
    const { hooks } = this.options;

    const responsePromise = this.fetch();

    const fetchFn = async <T extends unknown>(): Promise<T> => {
      let response = await responsePromise;

      for (const hook of hooks?.afterResponse ?? []) {
        const modifiedResponse = await hook(
          this.request,
          this.options,
          response
        );

        if (modifiedResponse instanceof globalThis.Response) {
          response = modifiedResponse;
        }
      }

      if (!response.ok && this.options.throwHttpErrors) {
        let error = new HTTPError(response, this.request);

        for (const hook of hooks?.beforeError ?? []) {
          error = await hook(error);
        }

        throw error;
      }

      return response.json();
    };

    return {
      ...responsePromise,
      json: fetchFn,
    };
  }

  public static create(requestInfo: RequestInfo, options?: FetchOptions) {
    return new Fetch(requestInfo, options).createResponsePromise();
  }

  public extend(options?: FetchOptions) {
    return new Fetch(this.input, { ...this.options, ...options });
  }
}
