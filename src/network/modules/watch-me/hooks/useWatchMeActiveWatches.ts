import { useMemo } from 'react';
import { useFetchUserActiveWatch } from '../queries';
import { mapWatchMeSessionsToActiveWatches } from '../utils';

/**
 * Active Watch Me sessions where the current user is the emergency contact,
 * mapped for map + bottom strip UI. Polls via {@link useFetchUserActiveWatch}.
 */
export function useWatchMeActiveWatches() {
  const query = useFetchUserActiveWatch();

  const watches = useMemo(
    () => mapWatchMeSessionsToActiveWatches(query.data?.sessions ?? []),
    [query.data?.sessions]
  );

  return {
    watches,
    isContactInActiveSession: query.data?.is_contact_in_active_session ?? false,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
