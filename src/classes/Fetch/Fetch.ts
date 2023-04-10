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

    const { prefixUrl, searchParams, hooks, ...restOptions } = this.options;

    if (prefixUrl) {
      url = this.options.prefixUrl + "/" + this.requestInfo.toString();
    }

    if (searchParams) {
      url = url.replace(/(?:\?.*?)?(?=#|$)/, "?" + searchParams.toString());
    }

    if (hooks?.beforeRequest) {
      hooks?.beforeRequest.forEach((callback) => callback(request));
    }

    // add trailing slash to url if it's missing
    url = url.replace(/(^[^\?]*\w$)/, "$1/");

    const responsePromise = fetch(url, {
      ...restOptions,
    });

    return {
      ...responsePromise,
      json: () =>
        responsePromise.then((response) => {
          if (!response.ok) {
            throw new HTTPError(response, request);
          }

          return response.json();
        }),
    };
  }

  public static create(requestInfo: RequestInfo, options?: FetchOptions) {
    return new Fetch(requestInfo, options).createResponsePromise();
  }

  public extend(options?: FetchOptions) {
    return new Fetch(this.requestInfo, { ...this.options, ...options });
  }
}
