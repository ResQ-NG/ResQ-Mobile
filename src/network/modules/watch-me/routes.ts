const VersionAlias = 'v1';
const WatchMeAlias = 'watch-me';

export const WatchMeRoutes = {
  Create: `${VersionAlias}/${WatchMeAlias}`,
  FetchUserActiveWatch: `${VersionAlias}/${WatchMeAlias}/active-as-contact`,
} as const;
