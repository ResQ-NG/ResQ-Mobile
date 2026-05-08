import { QueryKey } from "@tanstack/react-query";

/**
 * This interface defines the configuration for mutation requests.
 * It includes options for transforming request and response data,
 * handling headers, tracking the operation, and managing query invalidation.
 *
 * @template TVariables - The type for the variables passed to the mutation request (e.g., the data you send).
 * @template TData - The type of the response data expected from the API.
 */
export interface MutationConfig<TVariables, TData> {
  /**
   * The endpoint to which the mutation request is sent.
   * This can be either a static string or a function that generates the endpoint based on the variables.
   * This is usually a URL or a path relative to the base API URL.
   *
   * @example
   * endpoint: '/api/users'
   * @example
   * endpoint: (variables) => `/api/users/${variables.userId}`
   */
  endpoint: string | ((variables: TVariables) => string);

  /**
   * The HTTP method for the mutation request.
   * Defaults to 'POST', but can be 'PUT', 'DELETE', 'PATCH', 'POSTFORM', 'PUTFORM', or 'PATCHFORM'.
   */
  method?:
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "postForm"
    | "putForm"
    | "patchForm";

  /**
   * A function to transform the request data before sending it to the server.
   * This is useful when you need to change the structure of the request (e.g., converting an object to FormData).
   *
   * @param variables - The data you are sending with the request.
   * @returns The transformed data, either as a plain object or FormData.
   */
  transformRequest?: (
    variables: TVariables
  ) => Record<string, unknown> | FormData;

  /**
   * A function to transform the response data received from the server.
   * This is useful if the API returns data in a format that needs to be changed
   * (e.g., flattening nested objects, extracting specific fields).
   *
   * @param response - The raw response data from the API.
   * @returns The transformed response data that matches the expected type (TData).
   */
  transformResponse?: (response: unknown) => TData;

  /**
   * A function to generate custom headers for the mutation request.
   * This is useful when headers are dynamic and depend on the request data (e.g., Authorization headers).
   *
   * @param variables - The data you're sending in the request.
   * @returns A record of headers to include in the request.
   */
  getHeaders?: (variables: TVariables) => Record<string, string>;

  /**
   * The name of the operation being performed (e.g., 'CreateUser', 'UpdateProfile').
   * This can be useful for logging, debugging, or tracking the operation in analytics.
   */
  operationName: string;

  /**
   * A function to retrieve additional context data that might be needed during the mutation.
   * This is typically used for things like tracking IDs or other metadata that can influence the request.
   *
   * @param variables - The data you're sending in the request.
   * @returns A record of additional context information to include with the mutation.
   */
  getContextData?: (variables: TVariables) => Record<string, unknown>;

  /**
   * A success message to be shown once the mutation is successful.
   * This can either be a static string or a function that generates a dynamic message based on the response data.
   *
   * @param data - The response data from the API that can be used to customize the message.
   * @returns A string message to display after the mutation succeeds.
   */
  successMessage?: string | ((data: TData) => string);

  /**
   * A list of queries to invalidate after the mutation succeeds.
   * This is useful if the mutation affects the data you want to keep updated.
   * Invalidation will trigger a refetch for these queries to keep the app state in sync.
   * The reason it's inside a 2D array is because we may have nested cases we might want to capture.
   * @example
   * invalidateQueries: [
   * ["userList", "userDetails"], ["userList", "userDetails"]
   * ]
   */
  invalidateQueries?: QueryKey[];

  /**
   * Custom onSuccess handler that will be called after the mutation succeeds.
   * This allows for additional logic to be executed beyond the default success handling.
   *
   * @param variables - The payload you sent to the API
   * @param data - The response data from the API
   */
  onSuccess?: (variables: TVariables, data: TData) => void;

  /**
   * Flag to suppress error messages from being displayed to the user.
   * When set to true, error messages will not be shown in the UI.
   */
  suppressErrorMessage?: boolean;

  /**
   * Flag to suppress success messages from being displayed to the user.
   * When set to true, success messages will not be shown in the UI.
   */
  suppressSuccessMessage?: boolean;
}

/**
 * Configuration interface for API query operations.
 * This interface defines the structure for configuring data fetching operations.
 *
 * @template TParams - The type of parameters used for the query
 * @template TData - The type of data returned by the query
 */
export interface QueryConfig<TParams, TData> {
  /**
   * The API endpoint to fetch data from.
   * Can be either a static string or a function that generates the endpoint based on parameters.
   *
   * @example
   * endpoint: '/api/users'
   * @example
   * endpoint: (params) => `/api/users/${params.userId}`
   */
  endpoint: string | ((params: TParams) => string);

  /**
   * The query key used for caching and deduplication.
   * This key uniquely identifies the query in the query cache.
   */
  queryKey: QueryKey;

  /**
   * Optional function to transform the API response before it's returned.
   * Useful for normalizing data or extracting specific parts of the response.
   *
   * @param response - The raw response from the API
   * @returns The transformed data
   */
  transformResponse?: (response: unknown) => TData;

  /**
   * Optional function to generate custom headers for the query request.
   * Useful for adding authentication tokens or other dynamic headers.
   *
   * @param params - The parameters for the query
   * @returns A record of headers to include in the request
   */
  getHeaders?: (params: TParams) => Record<string, string>;

  /**
   * The name of the operation being performed.
   * Used for logging, debugging, and error tracking purposes.
   */
  operationName: string;

  /**
   * Optional function to retrieve additional context data for logging.
   * Useful for adding metadata to error logs or analytics.
   *
   * @param params - The parameters for the query
   * @returns A record of additional context information
   */
  getContextData?: (params: TParams) => Record<string, unknown>;

  /**
   * Optional function to determine if the query should be enabled.
   * If this returns false, the query will not execute.
   *
   * @param params - The parameters for the query
   * @returns Boolean indicating whether the query should run
   */
  enabled?: (params: TParams) => boolean;

  /**
   * Optional field to specify the name of the data field in the API response.
   * This is useful for extracting the main data array or object from the response on the calls that we would make for traditional pagination
   */
  dataField?: string;

  terminateIfNotAuthenticated?: boolean;
}

export interface InfiniteQueryConfig<TParams, TData> {
  /**
   * The endpoint URL or a function that returns the URL based on the provided parameters.
   * This is the target API endpoint where the query will be sent.
   * If a function is provided, it should accept the query parameters and return a string URL.
   */
  endpoint: string | ((params: TParams) => string);

  /**
   * The base query key used for caching and deduplication of queries.
   * This key uniquely identifies the query in the cache and is extended with parameters and pagination details.
   */
  queryKey: QueryKey;

  /**
   * The name of the operation being performed, primarily used for logging purposes.
   * This helps in tracking and debugging the specific operation being executed.
   */
  operationName: string;

  /**
   * An optional function to transform the API response into the desired format.
   * This is useful for normalizing data or extracting specific parts of the response.
   *
   * @param data - The raw data received from the API response.
   * @returns The transformed data in the desired format.
   */
  transformResponse?: (data: unknown) => TData;

  /**
   * An optional function to generate custom headers for the API request.
   * This can be used to add authentication tokens or other dynamic headers.
   *
   * @param params - The parameters for the query.
   * @returns A record of headers to include in the request.
   */
  getHeaders?: (params: TParams) => Record<string, string>;

  /**
   * An optional function to retrieve additional context data for error logging.
   * This is useful for adding metadata to error logs or analytics.
   *
   * @param params - The parameters for the query.
   * @returns A record of additional context information.
   */
  getContextData?: (params: TParams) => Record<string, unknown>;

  /**
   * An optional function to determine if the query should be enabled.
   * If this function returns false, the query will not execute.
   *
   * @param params - The parameters for the query.
   * @returns A boolean indicating whether the query should run.
   */
  enabled?: (params: TParams) => boolean;

  /**
   * The name of the page parameter in the API, which defaults to 'page'.
   * This is used to specify the current page of data being requested.
   */
  pageParamKey?: string;

  /**
   * The name of the field in the API response that contains the data array.
   * This field is used to extract the list of items from the response.
   */
  dataField: string;

  /**
   * An optional function to determine if there are more pages to fetch.
   * This function evaluates the last page of data and all pages fetched so far to decide if additional pages are available.
   *
   * @param lastPage - The last page of data received from the API.
   * @param allPages - An array of all pages of data received so far.
   * @returns A boolean indicating whether more pages are available to fetch.
   */
  getHasNextPage?: (lastPage: unknown, allPages: unknown[]) => boolean;
}

/** ===============================
 *  API Response Types
 *  =============================== */
export type ApiSuccess<T> = {
  success: true;
  status: number;
  message: string;
  data: T;
  timestamp?: string;
  requestId?: string;
};

export type ApiFailure = {
  success: false;
  status: number;
  message: string;
  kind: "network" | "http" | "validation" | "timeout" | "cancelled" | "unknown";
  error?: unknown;
  code?: string;
  timestamp?: string;
  requestId?: string;
};

export type ApiValidationError = Record<string, string[]>;

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

/**
 * Typical HTTP 200 body from the ResQ server. `http-config` unwraps `data` into
 * {@link ApiSuccess} (or maps non-2xx `code` to {@link ApiFailure} with `message`).
 */
export type ServerWrappedResponse<T = unknown> = {
  code: number;
  data: T;
  message: string;
};

export interface PaginatedResult<TData> {
  items?: TData[];
  nextPage?: number;
  totalPages?: number;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
}

export interface CursorPaginatedResult<TData> {
  items: TData[];
  nextCursor?: string;
}

export interface DefaultQueryParamsDTO {
  query?: string[] | string;
  page_size?: string | number;
}

export interface ReactNativeFileDTO {
  uri: string;
  name: string;
  type: string;
}
