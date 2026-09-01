// Copyright (c) Abstract Machines
// SPDX-License-Identifier: Apache-2.0

interface Error {
  status: number;
  error: string;
}

export default class Errors {
  static HandleError(error: string, statusCode: number): Error {
    const message: Error = {
      status: statusCode,
      error,
    };

    return message;
  }

  /**
   * Safely extracts an error message from a failed fetch Response.
   *
   * Not every non-2xx response carries a JSON body (an empty 500, a proxy
   * error page, a plain-text 404, etc.), so calling `response.json()`
   * unconditionally can throw its own confusing `SyntaxError` and hide the
   * real failure behind "Unexpected end of JSON input". This falls back to
   * the response's status text when the body is missing or isn't valid JSON.
   * @param {globalThis.Response} response - The failed fetch Response to read a message from.
   * @returns {Promise<string>} The server-provided error message, or a fallback derived from the HTTP status.
   */
  static async ParseErrorMessage(
    response: globalThis.Response
  ): Promise<string> {
    try {
      const body = (await response.json()) as { message?: string };
      if (body?.message) {
        return body.message;
      }
    } catch {
      // Response had no body, or a body that isn't valid JSON.
    }

    return response.statusText || `Request failed with status ${response.status}`;
  }
}
