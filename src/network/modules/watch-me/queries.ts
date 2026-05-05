import { createApiQuery } from '@/network/config/api-client';
import { WatchMeRoutes } from './routes';
import type { FetchUserActiveWatchResponse } from './types';
import { WatchMeKeys } from './keys';

const ACTIVE_WATCH_POLL_MS = 30_000;

export const useFetchUserActiveWatch = createApiQuery<
  void,
  FetchUserActiveWatchResponse
>(
  {
    endpoint: WatchMeRoutes.FetchUserActiveWatch,
    operationName: 'Fetch User Active Watch',
    queryKey: [WatchMeKeys.FetchUserActiveWatch],
    terminateIfNotAuthenticated: true,
  },
  false,
  {
    refetchInterval: ACTIVE_WATCH_POLL_MS,
    refetchIntervalInBackground: true,
  }
);
