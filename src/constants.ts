import { HttpMethod } from "@types";

export const STOP = Symbol("stop");

export const REQUEST_METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "HEAD",
  "DELETE",
];
