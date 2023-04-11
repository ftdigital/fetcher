import { ResponsePromise } from "@types";
import { HTTPError } from "../HTTPError";
import { FetchOptions, Input } from "./Fetch.types";

export class Fetch {
  input: Input;
  options: FetchOptions = { throwHttpErrors: true };
  request: Request;

  constructor(input: Input, options?: FetchOptions) {
    this.input = input;
    this.options = { ...this.options, ...options };

    this.request = new globalThis.Request(this.input, this.options);
  }

  private async fetch(): Promise<Response> {
    for (const hook of this.options.hooks?.beforeRequest ?? []) {
      const result = hook(this.request, this.options);

      if (result instanceof Request) {
        this.request = result;
        break;
      }

      if (result instanceof Response) {
        return result;
      }
    }

    return fetch(this.request.clone(), this.options);
  }

  private createResponsePromise(): ResponsePromise {
    let url = this.request.url;

    const { prefixUrl, searchParams, hooks } = this.options;

    if (prefixUrl) {
      url = this.options.prefixUrl + "/" + this.input.toString();
    }

    if (searchParams) {
      url = url.replace(/(?:\?.*?)?(?=#|$)/, "?" + searchParams.toString());
    }

    // add trailing slash to url if it's missing
    url = url.replace(/(^[^\?]*\w$)/, "$1/");

    const responsePromise = this.fetch();

    const fetchFn = async () => {
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
