import 'react-native-get-random-values';
import { AppConfig } from '@/lib/app-config';
import {
  LEGACY_AUTH_TOKEN_KEY,
  useAuthTokenStore,
} from '@/stores/auth-token-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
  isCancel,
} from 'axios';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { ApiSuccess, ApiFailure, ApiEnvelope } from '@/network/config/types';
import { isPlainRecord } from '@/network/config/type-guards';
import { logError, logger } from '@/lib/utils/logger';

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    startTime?: number;
    disableLogging?: boolean;
  }
}

function readBodyMessage(data: unknown): string | undefined {
  if (!isPlainRecord(data)) return undefined;
  for (const key of ['message', 'msg', 'detail'] as const) {
    const v = data[key];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return undefined;
}

function readBodyOptionalString(
  data: unknown,
  key: string
): string | undefined {
  if (!isPlainRecord(data)) return undefined;
  const v = data[key];
  return typeof v === 'string' ? v : undefined;
}

function readErrorPayloadFields(payload: unknown): {
  code?: string;
  requestId?: string;
  timestamp?: string;
  message?: string;
} {
  if (!isPlainRecord(payload)) {
    return {};
  }
  const nested = payload.error;
  const errObj = isPlainRecord(nested) ? nested : undefined;
  const codeFromErr =
    errObj && typeof errObj.code === 'string' ? errObj.code : undefined;
  const nestedMsg =
    errObj && typeof errObj.message === 'string' ? errObj.message : undefined;
  const topMsg =
    typeof payload.message === 'string' ? payload.message : undefined;
  const requestId =
    typeof payload.requestId === 'string' ? payload.requestId : undefined;
  const ts = payload.timestamp;
  const timestamp =
    typeof ts === 'string' || typeof ts === 'number' ? String(ts) : undefined;

  const numericCode =
    typeof payload.code === 'number' ? String(payload.code) : undefined;

  return {
    code: codeFromErr ?? numericCode,
    requestId,
    timestamp,
    message: nestedMsg ?? topMsg,
  };
}

function errorHasCanceledFlag(e: unknown): boolean {
  if (typeof e !== 'object' || e === null) return false;
  return (
    'isCanceled' in e && (e as { isCanceled?: boolean }).isCanceled === true
  );
}

function getContentTypeHeader(
  headers: InternalAxiosRequestConfig['headers']
): string | undefined {
  if (headers instanceof AxiosHeaders) {
    const v = headers.get('Content-Type');
    return v == null ? undefined : String(v);
  }
  if (isPlainRecord(headers)) {
    const ct = headers['Content-Type'];
    return typeof ct === 'string' ? ct : undefined;
  }
  return undefined;
}

/** ===============================
 *  Helper: generate Idempotency Key
 *  =============================== */
function withIdempotency(
  config?: RequestCfg,
  key?: string
): RequestCfg & { headers: AxiosHeaders } {
  const newConfig = { ...config };

  // Ensure headers exist and is an AxiosHeaders instance
  if (!newConfig.headers) {
    newConfig.headers = new AxiosHeaders();
  } else if (!(newConfig.headers instanceof AxiosHeaders)) {
    // Convert plain object to AxiosHeaders if needed
    newConfig.headers = new AxiosHeaders(newConfig.headers);
  }

  // Use AxiosHeaders set method to add the idempotency key
  (newConfig.headers as AxiosHeaders).set('Idempotency-Key', key ?? uuidv4());

  return newConfig as RequestCfg & { headers: AxiosHeaders };
}

/** ===============================
 *  Configuration
 *  =============================== */

export const BASE_URL = AppConfig.BASE_URL ?? '';
const REQUEST_TIMEOUT = 15000;

/** ===============================
 *  Axios Instance
 *  =============================== */
export const http: AxiosInstance = axios.create({
  baseURL: AppConfig.BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    Accept: 'application/json',
  },
});

/** ===============================
 *  Unauthorized Handler
 *  =============================== */
let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

/** Authorization scheme for API requests (`Authorization: Bearer <token>`). */
export const HTTP_AUTH_SCHEME = 'Bearer';

/** Strip a leading `Bearer ` prefix so we never send `Bearer Bearer …`. */
function normalizeBearerToken(raw: string): string {
  const t = raw.trim();
  if (/^Bearer\s+/i.test(t)) {
    return t.replace(/^Bearer\s+/i, '').trim();
  }
  return t;
}

/**
 * Retrieves the auth token from storage.
 * Uses the Zustand store first, then rehydrates from persist and checks the
 * legacy `auth_token` AsyncStorage key so we stay consistent across hydration races.
 */
const getStoredToken = async (): Promise<string | null> => {
  try {
    let token = useAuthTokenStore.getState().token;
    if (token && typeof token === 'string') {
      return token;
    }

    await useAuthTokenStore.persist.rehydrate();
    token = useAuthTokenStore.getState().token;
    if (token && typeof token === 'string') {
      return token;
    }

    const legacyToken = await AsyncStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
    if (legacyToken && typeof legacyToken === 'string') {
      useAuthTokenStore.getState().setToken(legacyToken);
      return legacyToken;
    }

    return null;
  } catch (error) {
    logger.error('Error retrieving auth token:', error);
    return null;
  }
};

/**
 * Syncs the auth token from the legacy AsyncStorage key into the Zustand store.
 * Useful for ensuring consistency during app startup.
 */
export const syncAuthToken = async (): Promise<void> => {
  try {
    await useAuthTokenStore.persist.rehydrate();
    const legacyToken = await AsyncStorage.getItem(LEGACY_AUTH_TOKEN_KEY);
    const { token, setToken } = useAuthTokenStore.getState();

    if (legacyToken !== null && legacyToken !== token) {
      setToken(legacyToken);
      logger.log('Auth token synced from storage to Zustand store');
    }
  } catch (error) {
    logger.error('Error syncing auth token:', error);
  }
};

/** ===============================
 *  Request Interceptor
 *  =============================== */
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Await token retrieval to ensure we have the latest token from storage
    const storedToken = await getStoredToken();
    const token =
      typeof storedToken === 'string' && storedToken ? storedToken : null;
    const requestId = uuidv4();
    config.startTime = Date.now();

    // Use AxiosHeaders methods to set headers instead of object replacement
    config.headers.set('X-Request-ID', requestId);
    config.headers.set('X-Client-Time', new Date().toISOString());
    config.headers.set('X-Device-Type', Platform.OS);
    config.headers.set('X-App-Version', AppConfig.APP_VERSION || '1.0.0');

    // Authorization: Bearer <token> (RFC 6750)
    if (token) {
      const credentials = normalizeBearerToken(token);
      if (credentials) {
        config.headers.set(
          'Authorization',
          `${HTTP_AUTH_SCHEME} ${credentials}`
        );
      }
    }

    // If sending FormData, avoid forcing a JSON content-type so RN can add boundary
    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (isFormData && config.headers instanceof AxiosHeaders) {
      config.headers.delete('Content-Type');
    }

    const method = (config.method ?? 'get').toLowerCase();
    if (
      ['post', 'put', 'patch'].includes(method) &&
      config.data != null &&
      !isFormData &&
      config.headers instanceof AxiosHeaders &&
      !config.headers.get('Content-Type')
    ) {
      config.headers.set('Content-Type', 'application/json');
    }

    // Development logging
    if (process.env.NODE_ENV === 'development' && !config.disableLogging) {
      const method = config.method?.toUpperCase() || 'REQUEST';
      logger.info(
        `%c→ [${method}] ${config.url}`,
        'color:#1E90FF; font-weight:bold;',
        {
          params: config.params,
          hasBody: !!config.data,
          requestId,
          isAuthenticated: !!token,
          tokenPreview: token
            ? `${token.slice(0, 8)}...${token.slice(-6)}`
            : 'No token',
          contentType: getContentTypeHeader(config.headers),
        }
      );
    }

    return config;
  },
  (error: unknown) => {
    logError(error, 'Request Interceptor Error', { stage: 'request' });
    return Promise.reject(error);
  }
);

/** ===============================
 *  Response Interceptor
 *  =============================== */
// Updated response interceptor to ignore canceled requests
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const start = response.config.startTime;
    const time = start != null ? Date.now() - start : 0;

    if (
      process.env.NODE_ENV === 'development' &&
      !response.config.disableLogging
    ) {
      const color = response.status < 400 ? 'green' : 'orange';
      logger.info(
        `%c← [${response.status}] ${response.config.url}`,
        `color:${color}; font-weight:bold;`,
        {
          responseTime: `${time}ms`,
          dataSize: response.data ? JSON.stringify(response.data).length : 0,
          timestamp: new Date().toISOString(),
          requestId: response.config.headers?.['X-Request-ID'],
        }
      );
    }

    return response;
  },
  (error: AxiosError) => {
    // Ignore/log nothing if the request was canceled
    if (isCancel(error)) {
      // Pass along the cancel, mark it with isCanceled
      return Promise.reject({ ...error, isCanceled: true });
    }

    const { config, response } = error;
    const start = config?.startTime;
    const time = start != null ? Date.now() - start : 0;

    const context = {
      url: config?.url,
      method: config?.method?.toUpperCase(),
      responseTime: `${time}ms`,
      status: response?.status,
      statusText: response?.statusText,
      requestId: config?.headers?.['X-Request-ID'],
    };

    logError(error, 'API Response Error', context);

    if (isAxiosError(error) && error.response?.status === 401) {
      onUnauthorized?.();
    }

    return Promise.reject(error);
  }
);

/** ===============================
 *  Success / Failure Helpers
 *  =============================== */
function isServerWrappedBody(
  body: unknown
): body is { code: number; data: unknown; message?: unknown } {
  if (!isPlainRecord(body)) return false;
  if (typeof body.code !== 'number') return false;
  return Object.prototype.hasOwnProperty.call(body, 'data');
}

function toSuccess<T>(
  res: { status: number; statusText: string; data: unknown },
  fallbackMsg?: string
): ApiEnvelope<T> {
  const body = res.data;

  if (isServerWrappedBody(body)) {
    const msg =
      typeof body.message === 'string' && body.message.length > 0
        ? body.message
        : (fallbackMsg ?? res.statusText ?? 'OK');

    if (body.code >= 200 && body.code < 300) {
      return {
        success: true,
        status: res.status,
        message: msg,
        data: body.data as T,
        timestamp:
          readBodyOptionalString(body, 'timestamp') ?? new Date().toISOString(),
        requestId: readBodyOptionalString(body, 'requestId'),
      };
    }

    const kind: ApiFailure['kind'] =
      body.code === 422 ? 'validation' : 'http';

    return {
      success: false,
      status: body.code,
      kind,
      message: msg,
      error: body,
      code: String(body.code),
      timestamp:
        readBodyOptionalString(body, 'timestamp') ?? new Date().toISOString(),
      requestId: readBodyOptionalString(body, 'requestId'),
    };
  }

  const msgFromBody =
    readBodyMessage(body) ?? fallbackMsg ?? res.statusText ?? 'OK';

  return {
    success: true,
    status: res.status,
    message: String(msgFromBody),
    data: body as T,
    timestamp:
      readBodyOptionalString(body, 'timestamp') ?? new Date().toISOString(),
    requestId: readBodyOptionalString(body, 'requestId'),
  };
}

function toFailure(e: unknown): ApiFailure {
  // Handle cancelled requests
  if (errorHasCanceledFlag(e) || isCancel(e)) {
    return {
      success: false,
      status: 0,
      kind: 'cancelled',
      message: 'Request was cancelled',
      error: e,
      timestamp: new Date().toISOString(),
    };
  }

  if (isAxiosError(e)) {
    const status = e.response?.status ?? 0;
    const payload = e.response?.data;
    const {
      code,
      requestId,
      timestamp,
      message: payloadMsg,
    } = readErrorPayloadFields(payload);

    let kind: ApiFailure['kind'] = 'unknown';

    if (!e.response) {
      kind = e.code === 'ECONNABORTED' ? 'timeout' : 'network';
      return {
        success: false,
        status: 0,
        kind,
        message:
          kind === 'timeout'
            ? 'Request timeout'
            : 'Network error: Unable to reach server',
        error: e.message,
        timestamp: new Date().toISOString(),
      };
    }

    if (status === 422) {
      kind = 'validation';
      return {
        success: false,
        status,
        kind,
        message: 'Validation failed',
        error: payload,
        requestId,
        timestamp,
      };
    }

    const msg = payloadMsg ?? e.message ?? 'Request failed';

    return {
      success: false,
      status,
      kind: 'http',
      message: String(msg),
      error: payload ?? e.toString?.(),
      code,
      requestId,
      timestamp,
    };
  }

  return {
    success: false,
    status: 0,
    kind: 'unknown',
    message: e instanceof Error ? e.message : 'Unknown error',
    error: e,
    timestamp: new Date().toISOString(),
  };
}

/** ===============================
 *  Plain Request Helpers
 *  =============================== */
export type RequestCfg = Omit<
  InternalAxiosRequestConfig,
  'url' | 'method' | 'data'
> & {
  disableLogging?: boolean;
};

export async function apiGet<T = unknown>(
  path: string,
  config?: RequestCfg
): Promise<ApiEnvelope<T>> {
  try {
    const res = await http.get<T>(path, config);
    return toSuccess<T>(res);
  } catch (e) {
    return toFailure(e);
  }
}

export async function apiPost<T = unknown, P = unknown>(
  path: string,
  payload?: P,
  config?: RequestCfg & { idempotencyKey?: string }
): Promise<ApiEnvelope<T>> {
  try {
    const res = await http.post<T>(
      path,
      payload,
      withIdempotency(config, config?.idempotencyKey)
    );
    return toSuccess<T>(res, 'Created');
  } catch (e) {
    return toFailure(e);
  }
}

export async function apiPatch<T = unknown, P = unknown>(
  path: string,
  payload?: P,
  config?: RequestCfg & { idempotencyKey?: string }
): Promise<ApiEnvelope<T>> {
  try {
    const res = await http.patch<T>(
      path,
      payload,
      withIdempotency(config, config?.idempotencyKey)
    );
    return toSuccess<T>(res, 'Updated');
  } catch (e) {
    return toFailure(e);
  }
}

export async function apiPut<T = unknown, P = unknown>(
  path: string,
  payload?: P,
  config?: RequestCfg & { idempotencyKey?: string }
): Promise<ApiEnvelope<T>> {
  try {
    const res = await http.put<T>(
      path,
      payload,
      withIdempotency(config, config?.idempotencyKey)
    );
    return toSuccess<T>(res);
  } catch (e) {
    return toFailure(e);
  }
}

export async function apiDelete<T = unknown>(
  path: string,
  config?: RequestCfg
): Promise<ApiEnvelope<T>> {
  try {
    const res = await http.delete<T>(path, config);
    return toSuccess<T>(res, 'Deleted');
  } catch (e) {
    return toFailure(e);
  }
}

export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData,
  config?: RequestCfg & {
    /** Aligns with axios upload progress payloads. */
    onUploadProgress?: (progressEvent: {
      loaded: number;
      total?: number;
      progress?: number;
      bytes?: number;
    }) => void;
  }
): Promise<ApiEnvelope<T>> {
  try {
    const res = await http.post<T>(path, formData, {
      ...config,
      headers: {
        ...(config?.headers ?? {}),
        'Content-Type': 'multipart/form-data',
      },
    });
    return toSuccess<T>(res, 'Uploaded');
  } catch (e) {
    return toFailure(e);
  }
}

/** ===============================
 *  Type Guards
 *  =============================== */
export const isOk = <T>(r: ApiEnvelope<T>): r is ApiSuccess<T> => r.success;
export const isErr = <T>(r: ApiEnvelope<T>): r is ApiFailure => !r.success;

/** Check if the API response is a cancelled request */
export const isCancelled = <T>(r: ApiEnvelope<T>): r is ApiFailure =>
  !r.success && r.kind === 'cancelled';

/** Check if the API response is an error that should be shown to the user */
export const isUserFacingError = <T>(r: ApiEnvelope<T>): r is ApiFailure =>
  !r.success && r.kind !== 'cancelled';

export default http;
