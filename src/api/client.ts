export type ApiErrorKind = "http" | "invalid-response";

/** Structured API failure: an HTTP status error or a response with an unexpected shape. */
export class ApiError extends Error {
  readonly status: number | null;
  readonly kind: ApiErrorKind;

  constructor(message: string, kind: ApiErrorKind, status: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }

  get isNotFound(): boolean {
    return this.kind === "http" && this.status === 404;
  }
}

/** Type guard for errors caught as `unknown`. */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

type RequestOptions = {
  signal?: AbortSignal;
};

/**
 * Small typed HTTP client. Every response is read as `unknown` and must pass a
 * type guard before the rest of the app sees it, so `T` is checked at runtime,
 * not just asserted.
 */
export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async get<T>(path: string, isExpected: (data: unknown) => data is T, { signal }: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, { signal });

    if (!response.ok) {
      throw new ApiError(`Request to ${path} failed with status ${response.status}`, "http", response.status);
    }

    const data: unknown = await response.json();
    if (!isExpected(data)) {
      throw new ApiError(`Unexpected response shape from ${path}`, "invalid-response", response.status);
    }
    return data;
  }
}
