import {
  useAuthTokenStore,
  type AuthTokenState,
} from '@/stores/auth-token-store';
import type { QueryKey } from '@tanstack/react-query';
import {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosHeaders } from 'axios';
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  isCancelled,
  isOk,
} from './http-config';
import { showToast } from '@/lib/utils/app-toast';
import { logError } from '@/lib/utils/logger';
import {
  ApiEnvelope,
  ApiFailure,
  CursorPaginatedResult,
  InfiniteQueryConfig,
  MutationConfig,
  PaginatedResult,
  QueryConfig,
} from './types';
import { isPlainRecord } from './type-guards';
import { formatFieldErrorsForToast } from './api-field-errors';

/** =====================================================
 * Utility Helpers
 * ===================================================== */

/**
 * Converts a simple object of headers into AxiosHeaders
 */
const toAxiosHeaders = (headers: Record<string, string>) => {
  const axiosHeaders = new AxiosHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    axiosHeaders.set(key, value);
  });
  return axiosHeaders;
};

/**
 * Ensures stable query keys by filtering, sorting, and serializing parameters.
 */
function normalizeQueryKey(baseKey: readonly unknown[], params?: unknown) {
  const keyParts = [...baseKey];
  if (
    params !== undefined &&
    params !== null &&
    typeof params === 'object' &&
    !Array.isArray(params)
  ) {
    Object.entries(params as Record<string, unknown>)
      .filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        keyParts.push({ [key]: value });
      });
  }
  return keyParts;
}

/** =====================================================
 * Error Class
 * ===================================================== */
export class ApiError<T = unknown> extends Error {
  status: number;
  kind: ApiFailure['kind'];
  original: ApiEnvelope<T>;

  constructor(envelope: ApiEnvelope<T>) {
    super(envelope.message);
    this.status = envelope.status;
    this.kind = envelope.success ? 'unknown' : envelope.kind;
    this.original = envelope;
  }
}

/** =====================================================
 * Envelope Handler
 * ===================================================== */
async function executeApiCall<T>(
  apiFunction: () => Promise<ApiEnvelope<T>>
): Promise<T> {
  const result = await apiFunction();
  if (!isOk(result)) {
    throw new ApiError(result);
  }
  return result.data;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const orig = error.original;
    if (!orig.success) {
      const fields = formatFieldErrorsForToast(orig.error);
      if (fields) return fields;
    }
    return orig.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

/** =====================================================
 * Default Config
 * ===================================================== */
const DEFAULT_USE_QUERY_SHOW_ERROR = true;

/** =====================================================
 * React Query Mutations
 * ===================================================== */
export function useApiMutation<TVariables = unknown, TData = unknown>(
  config: MutationConfig<TVariables, TData>,
  options?: Omit<
    import('@tanstack/react-query').UseMutationOptions<
      TData,
      Error,
      TVariables
    >,
    'mutationFn'
  >,
  callBack?: () => void
) {
  const queryClient = useQueryClient();

  const showSuccess = (message: string) => {
    if (!config.suppressSuccessMessage) {
      showToast({ message, variant: 'success' });
    }
  };

  const showError = (message: string) => {
    if (!config.suppressErrorMessage) {
      showToast({ message, variant: 'error' });
    }
  };

  return useMutation({
    ...options, // User options first (can be overridden)
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const method = config.method || 'post';
      const headers = config.getHeaders?.(variables) || {};
      const data = config.transformRequest?.(variables) || variables;

      // add the client source header to the headers
      headers['X-Client-Source'] = 'rider-app';

      const endpoint =
        typeof config.endpoint === 'function'
          ? config.endpoint(variables)
          : config.endpoint;

      try {
        let response: Promise<ApiEnvelope<TData>>;

        switch (method.toLowerCase()) {
          case 'get':
            response = apiGet(endpoint, { headers: toAxiosHeaders(headers) });
            break;
          case 'post':
            response = apiPost(endpoint, data, {
              headers: toAxiosHeaders(headers),
            });
            break;
          case 'put':
            response = apiPut(endpoint, data, {
              headers: toAxiosHeaders(headers),
            });
            break;
          case 'patch':
            response = apiPatch(endpoint, data, {
              headers: toAxiosHeaders(headers),
            });
            break;
          case 'delete':
            response = apiDelete(endpoint, {
              headers: toAxiosHeaders(headers),
            });
            break;
          case 'postform':
            response = apiPost(endpoint, data, {
              headers: toAxiosHeaders({
                ...headers,
                'Content-Type': 'multipart/form-data',
              }),
            });
            break;
          case 'patchform':
            response = apiPatch(endpoint, data, {
              headers: toAxiosHeaders({
                ...headers,
                'Content-Type': 'multipart/form-data',
              }),
            });
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        return await executeApiCall(() => response);
      } catch (error: unknown) {
        // Don't log cancelled requests
        const isCancelledRequest =
          error instanceof ApiError && isCancelled(error.original);

        if (!isCancelledRequest) {
          logError(
            error,
            config.operationName,
            config.getContextData?.(variables) || {}
          );
        }
        throw error;
      }
    },

    onSuccess: (data, variables, context, ...rest) => {
      // Call user-provided onSuccess first
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context, ...rest);
      }

      // Then call config onSuccess
      config.onSuccess?.(variables, data);

      const message =
        (typeof config.successMessage === 'function'
          ? config.successMessage(data)
          : config.successMessage) ||
        (isPlainRecord(data) && typeof data.message === 'string'
          ? data.message
          : null) ||
        'Operation completed successfully';

      showSuccess(message);

      config.invalidateQueries?.forEach((qk: QueryKey) => {
        queryClient.invalidateQueries({ queryKey: qk });
      });

      callBack?.();
    },

    onError: (error: Error, variables, context, ...rest) => {
      // Call user-provided onError first
      if (options?.onError) {
        options.onError(error, variables, context, ...rest);
      }

      // Don't show error messages for cancelled requests
      if (error instanceof ApiError && isCancelled(error.original)) {
        return;
      }

      // Then handle our error display
      if (config.suppressErrorMessage) {
        return;
      }
      showError(getApiErrorMessage(error));
    },
  });
}

/** =====================================================
 * React Query (Standard)
 * ===================================================== */
export function useApiQuery<TParams = unknown, TData = unknown>(
  config: QueryConfig<TParams, TData>,
  params?: TParams,
  options?: Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'>,
  shouldShowError: boolean = DEFAULT_USE_QUERY_SHOW_ERROR
) {
  const authToken = useAuthTokenStore((s: AuthTokenState) => s.token);
  const finalQueryKey = normalizeQueryKey(config.queryKey, params);
  const isEnabled = config.enabled
    ? config.enabled(params ?? ({} as TParams))
    : true;

  return useQuery({
    queryKey: finalQueryKey,
    enabled:
      isEnabled &&
      options?.enabled !== false &&
      (config.terminateIfNotAuthenticated
        ? authToken !== null && authToken !== ''
        : true),
    ...options,
    queryFn: async ({ signal }): Promise<TData> => {
      try {
        const url =
          typeof config.endpoint === 'function'
            ? config.endpoint(params as TParams)
            : config.endpoint;

        const headers = config.getHeaders?.(params as TParams) || {};

        const response = await executeApiCall(() =>
          apiGet<TData>(url, {
            headers: toAxiosHeaders(headers),
            params,
            signal,
          })
        );

        return config.transformResponse
          ? (config.transformResponse(response) as TData)
          : (response as TData);
      } catch (error: unknown) {
        // Don't log or show errors for cancelled requests
        const isCancelledRequest =
          error instanceof ApiError && isCancelled(error.original);

        if (!isCancelledRequest) {
          logError(
            error,
            config.operationName,
            config.getContextData?.(params ?? ({} as TParams)) || {}
          );
          if (shouldShowError) {
            showToast({
              message: getApiErrorMessage(error),
              variant: 'error',
            });
          }
        }
        throw error;
      }
    },
  });
}

/** =====================================================
 * Infinite Query (Pagination)
 * ===================================================== */
export function useInfiniteApiQuery<
  TParams extends Record<string, unknown>,
  TData = unknown,
>(
  config: InfiniteQueryConfig<TParams, TData>,
  params?: TParams,
  options?: Omit<
    UseInfiniteQueryOptions<
      PaginatedResult<TData>,
      Error,
      PaginatedResult<TData>,
      QueryKey,
      number
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam'
  >,
  shouldShowError: boolean = DEFAULT_USE_QUERY_SHOW_ERROR
) {
  const pageParamKey = config.pageParamKey || 'page';
  const finalQueryKey = normalizeQueryKey(config.queryKey, params);
  const dataField = config.dataField || 'items';
  const isEnabled = config.enabled
    ? config.enabled(params ?? ({} as TParams))
    : true;

  return useInfiniteQuery<
    PaginatedResult<TData>,
    Error,
    PaginatedResult<TData>,
    QueryKey,
    number
  >({
    queryKey: finalQueryKey,
    enabled: isEnabled && options?.enabled !== false,
    initialPageParam: 1,
    ...options,

    queryFn: async ({ pageParam, signal }) => {
      const pageNum =
        typeof pageParam === 'number' && Number.isFinite(pageParam)
          ? pageParam
          : 1;

      const url =
        typeof config.endpoint === 'function'
          ? config.endpoint(params ?? ({} as TParams))
          : config.endpoint;

      const headers = config.getHeaders?.(params ?? ({} as TParams)) || {};

      const requestParams = {
        ...(params || {}),
        [pageParamKey]: pageNum,
      };

      try {
        const response = await executeApiCall(() =>
          apiGet<Record<string, unknown>>(url, {
            headers: toAxiosHeaders(headers),
            params: requestParams,
            signal,
          })
        );

        const root = isPlainRecord(response) ? response : {};
        const nested = root.data;
        const dataContainer = isPlainRecord(nested) ? nested : {};
        const metaRaw = dataContainer.meta;
        const meta = isPlainRecord(metaRaw) ? metaRaw : {};
        const itemsRaw = dataContainer[dataField];
        const items = Array.isArray(itemsRaw) ? itemsRaw : [];

        const transformedItems: TData[] = config.transformResponse
          ? items.map((item) => config.transformResponse!(item) as TData)
          : (items as TData[]);

        const fromMetaPage = Number(meta.current_page);
        const currentPage =
          Number.isFinite(fromMetaPage) && fromMetaPage > 0
            ? fromMetaPage
            : pageNum;

        return {
          items: transformedItems,
          nextPage: currentPage + 1,
          totalPages: Number(meta.last_page),
          totalItems: Number(meta.total_records),
          currentPage,
          pageSize: Number(meta.page_size),
        };
      } catch (error: unknown) {
        // Don't log or show errors for cancelled requests
        const isCancelledRequest =
          error instanceof ApiError && isCancelled(error.original);

        if (!isCancelledRequest) {
          logError(
            error,
            config.operationName,
            config.getContextData?.(params ?? ({} as TParams)) || {}
          );
          if (shouldShowError) {
            showToast({
              message: getApiErrorMessage(error),
              variant: 'error',
            });
          }
        }
        throw error;
      }
    },

    getNextPageParam: (lastPage) =>
      lastPage?.currentPage &&
      lastPage?.totalPages &&
      lastPage?.currentPage < lastPage?.totalPages
        ? lastPage.nextPage
        : undefined,
  });
}

/** =====================================================
 * Infinite Query (Cursor Pagination)
 * ===================================================== */
export function useCursorInfiniteApiQuery<
  TParams extends Record<string, unknown>,
  TItem = unknown,
>(
  config: Omit<InfiniteQueryConfig<TParams, TItem>, 'pageParamKey' | 'dataField'> & {
    /** Request param name for cursor. Defaults to `cursor`. */
    cursorParamKey?: string;
  },
  params?: TParams,
  options?: Omit<
    UseInfiniteQueryOptions<
      CursorPaginatedResult<TItem>,
      Error,
      InfiniteData<CursorPaginatedResult<TItem>, string | null>,
      QueryKey,
      string | null
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >,
  shouldShowError: boolean = DEFAULT_USE_QUERY_SHOW_ERROR
) {
  const cursorParamKey = config.cursorParamKey || 'cursor';
  const finalQueryKey = normalizeQueryKey(config.queryKey, params);
  const isEnabled = config.enabled
    ? config.enabled(params ?? ({} as TParams))
    : true;

  return useInfiniteQuery<
    CursorPaginatedResult<TItem>,
    Error,
    InfiniteData<CursorPaginatedResult<TItem>, string | null>,
    QueryKey,
    string | null
  >({
    queryKey: finalQueryKey,
    enabled: isEnabled && options?.enabled !== false,
    initialPageParam: null,
    ...options,

    queryFn: async ({ pageParam, signal }) => {
      const url =
        typeof config.endpoint === 'function'
          ? config.endpoint(params ?? ({} as TParams))
          : config.endpoint;

      const headers = config.getHeaders?.(params ?? ({} as TParams)) || {};

      const requestParams: Record<string, unknown> = { ...(params || {}) };
      if (typeof pageParam === 'string' && pageParam.length > 0) {
        requestParams[cursorParamKey] = pageParam;
      }

      try {
        const response = await executeApiCall(() =>
          apiGet<Record<string, unknown>>(url, {
            headers: toAxiosHeaders(headers),
            params: requestParams,
            signal,
          })
        );

        const root = isPlainRecord(response) ? response : {};
        const itemsRaw = root.items;
        const items = Array.isArray(itemsRaw) ? itemsRaw : [];
        const nextCursorRaw = root.next_cursor;
        const nextCursor =
          typeof nextCursorRaw === 'string' && nextCursorRaw.trim().length > 0
            ? nextCursorRaw
            : undefined;

        const transformedItems: TItem[] = config.transformResponse
          ? items.map((item) => config.transformResponse!(item) as TItem)
          : (items as TItem[]);

        return { items: transformedItems, nextCursor };
      } catch (error: unknown) {
        const isCancelledRequest =
          error instanceof ApiError && isCancelled(error.original);

        if (!isCancelledRequest) {
          logError(
            error,
            config.operationName,
            config.getContextData?.(params ?? ({} as TParams)) || {}
          );
          if (shouldShowError) {
            showToast({
              message: getApiErrorMessage(error),
              variant: 'error',
            });
          }
        }
        throw error;
      }
    },

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

/** =====================================================
 * Factory Hook Creators
 * ===================================================== */

export function createApiMutation<TVariables = unknown, TData = unknown>(
  config: MutationConfig<TVariables, TData>
) {
  return (
    options?: Omit<
      import('@tanstack/react-query').UseMutationOptions<
        TData,
        Error,
        TVariables
      >,
      'mutationFn'
    >,
    callback?: () => void
  ) =>
    useApiMutation<TVariables, TData>(
      {
        ...config,
        suppressSuccessMessage: config?.suppressSuccessMessage ?? false,
        suppressErrorMessage: config?.suppressErrorMessage ?? false,
      },
      options,
      callback
    );
}

export function createApiQuery<TParams = unknown, TData = unknown>(
  config: QueryConfig<TParams, TData>,
  shouldShowError?: boolean,
  options: Omit<
    UseQueryOptions<TData, Error, TData>,
    'queryKey' | 'queryFn'
  > = {}
) {
  return (params?: TParams) =>
    useApiQuery(config, params, options, shouldShowError);
}

export function createInfiniteApiQuery<
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TData = unknown,
>(config: InfiniteQueryConfig<TParams, TData>) {
  return (
    params?: TParams,
    options?: Omit<
      UseInfiniteQueryOptions<
        PaginatedResult<TData>,
        Error,
        PaginatedResult<TData>,
        QueryKey,
        number
      >,
      'queryKey' | 'queryFn' | 'getNextPageParam'
    >,
    shouldShowError: boolean = DEFAULT_USE_QUERY_SHOW_ERROR
  ) => useInfiniteApiQuery(config, params, options, shouldShowError);
}

export function createCursorInfiniteApiQuery<
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TItem = unknown,
>(
  config: Omit<InfiniteQueryConfig<TParams, TItem>, 'pageParamKey' | 'dataField'> & {
    cursorParamKey?: string;
  }
) {
  return (
    params?: TParams,
    options?: Omit<
      UseInfiniteQueryOptions<
        CursorPaginatedResult<TItem>,
        Error,
        InfiniteData<CursorPaginatedResult<TItem>, string | null>,
        QueryKey,
        string | null
      >,
      'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
    >,
    shouldShowError: boolean = DEFAULT_USE_QUERY_SHOW_ERROR
  ) => useCursorInfiniteApiQuery(config, params, options, shouldShowError);
}

export function createPaginatedApiResponse<TParams = unknown, TData = unknown>(
  config: QueryConfig<TParams, PaginatedResult<TData>>,
  shouldShowError: boolean = DEFAULT_USE_QUERY_SHOW_ERROR
) {
  return (
    params?: TParams,
    options?: Omit<
      UseQueryOptions<PaginatedResult<TData>, Error, PaginatedResult<TData>>,
      'queryKey' | 'queryFn'
    >
  ) =>
    useApiQuery(
      {
        ...config,
        transformResponse: (responseData: unknown) => {
          const data = responseData as {
            data?: {
              [key: string]: unknown;
              meta?: { [key: string]: unknown };
            };
          };
          const items =
            (data?.data?.[config.dataField || 'data'] as unknown[]) || [];
          const transformedItems = items.map((item) => ({
            ...(item as object),
          }));
          const meta = data?.data?.meta || {};
          const currentPage = Number(meta.current_page) || 1;
          const lastPage = Number(meta.last_page) || 1;

          return {
            items: transformedItems,
            currentPage,
            nextPage: currentPage < lastPage ? currentPage + 1 : null,
            totalPages: lastPage,
            totalItems: Number(meta.total_records) || 0,
            pageSize: Number(meta.page_size) || 0,
          } as PaginatedResult<TData>;
        },
      },
      params,
      options,
      shouldShowError
    );
}
