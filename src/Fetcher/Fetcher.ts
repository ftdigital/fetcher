import { ResponsePromise } from "../types";
import { HTTPError } from "../HTTPError";
import { FetcherOptions } from "./Fetcher.types";

export class Fetcher {
  requestInfo: RequestInfo;
  options: FetcherOptions;

  constructor(requestInfo: RequestInfo, options?: FetcherOptions) {
    this.requestInfo = requestInfo;
    this.options = options ?? {};
  }

  private createResponsePromise(): ResponsePromise {
    const request = new Request(this.requestInfo);

    let url = request.url;

    if (this.options?.searchParams) {
      const textUrl = url.replace(
        /(?:\?.*?)?(?=#|$)/,
        this.options.searchParams.toString()
      );

      url = "?" + textUrl;
    }

    if (this.options.prefixUrl) {
      url = this.options.prefixUrl + "/" + url;
    }

    const responsePromise = fetch(url, {
      headers: this.options.headers,
      method: this.options.method,
      body: this.options.body,
    });

    return Object.assign(responsePromise, {
      json: () =>
        responsePromise.then((response) => {
          if (!response.ok) {
            throw new HTTPError(response, request);
          }

          return response.json();
        }),
    });
  }

  public static create(requestInfo: RequestInfo, options?: FetcherOptions) {
    return new Fetcher(requestInfo, options).createResponsePromise();
  }

  public extend(options?: FetcherOptions) {
    return new Fetcher(this.requestInfo, { ...this.options, ...options });
  }
}
