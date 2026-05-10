import { createApiQuery } from '@/network/config/api-client';
import { WatchMeRoutes } from './routes';
import type { FetchUserActiveWatchResponse } from './types';
import { WatchMeKeys } from './keys';
import { DefaultServerRequest } from '@/network/config/types';

const ACTIVE_WATCH_POLL_MS = 30_000;

export const useFetchUserActiveWatch = createApiQuery<
  DefaultServerRequest,
  FetchUserActiveWatchResponse
>(
  {
    endpoint: WatchMeRoutes.FetchUserActiveWatch,
    operationName: 'Fetch User Active Watch',
    queryKey: [WatchMeKeys.FetchUserActiveWatch],
    terminateIfNotAuthenticated: true,
  },
  {
    shouldShowError: false,
    refetchInterval: ACTIVE_WATCH_POLL_MS,
    refetchIntervalInBackground: true,
  }
);
