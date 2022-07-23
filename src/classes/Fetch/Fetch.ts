import { ResponsePromise } from "@types";
import { HTTPError } from "../HTTPError";
import { FetchOptions } from "./Fetch.types";

export class Fetch {
  requestInfo: RequestInfo;
  options: FetchOptions;

  constructor(requestInfo: RequestInfo, options?: FetchOptions) {
    this.requestInfo = requestInfo;
    this.options = options ?? {};
  }

  private createResponsePromise(): ResponsePromise {
    const request = new Request(this.requestInfo);

    let url = request.url;

    if (this.options.prefixUrl) {
      url = this.options.prefixUrl + "/" + this.requestInfo.toString();
    }

    if (this.options?.searchParams) {
      url = url.replace(
        /(?:\?.*?)?(?=#|$)/,
        "?" + this.options.searchParams.toString()
      );
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

  public static create(requestInfo: RequestInfo, options?: FetchOptions) {
    return new Fetch(requestInfo, options).createResponsePromise();
  }

  public extend(options?: FetchOptions) {
    return new Fetch(this.requestInfo, { ...this.options, ...options });
  }
}
