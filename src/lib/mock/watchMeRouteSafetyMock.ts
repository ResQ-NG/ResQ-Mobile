export interface MockRoute {
  id: string;
  label: string;
  /** e.g. "Via Airport Road" */
  via: string;
  distanceKm: number;
  durationMin: number;
  /** 0–100 */
  safetyScore: number;
  /** 'safe' | 'moderate' | 'caution' */
  safetyLevel: 'safe' | 'moderate' | 'caution';
  /** Hex accent colour shown on the card */
  accentColor: string;
  isRecommended: boolean;
  /**
   * SVG cubic-bezier path string drawn in a 280×160 viewBox.
   * Start = bottom-left (~Lugbe), End = top-right (~Kuje).
   */
  svgPath: string;
  /** One-line summary used in the recommendation / share copy */
  summary: string;
  /** Map camera center [lng, lat] until backend polyline is available */
  mapCenter: [number, number];
  mapZoom: number;
  /**
   * Future: route polyline as [lng, lat][] from the API.
   * When set, the map will render a LineString instead of origin/dest markers only.
   */
  polyline?: [number, number][];
}

/** Mock journey endpoints (Lugbe → Kuje, Abuja). */
export const MOCK_JOURNEY_ORIGIN: [number, number] = [7.3983, 8.9512];
export const MOCK_JOURNEY_DESTINATION: [number, number] = [7.2274, 8.8801];

/** Plain-language insight shown on the situational analytics slide. */
export interface MockRouteInsight {
  id: string;
  headline: string;
  body: string;
  tone: 'positive' | 'neutral' | 'caution';
}

export type MockMediaItemKind = 'video' | 'report' | 'photo';

export interface MockMediaItem {
  id: string;
  kind: MockMediaItemKind;
  title: string;
  subtitle: string;
  thumbnailUri: string;
  /** Video duration label, e.g. "2:14" */
  durationLabel?: string;
  authorLabel?: string;
}

export interface MockDestinationEvent {
  id: string;
  title: string;
  detail: string;
  /** 'alert' | 'info' | 'warning' */
  type: 'alert' | 'info' | 'warning';
  timeAgo: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const MOCK_ROUTES: MockRoute[] = [
  {
    id: 'r1',
    label: 'Route 1',
    via: 'Via Airport Road',
    distanceKm: 22.4,
    durationMin: 38,
    safetyScore: 87,
    safetyLevel: 'safe',
    accentColor: '#22c55e',
    isRecommended: true,
    // Most direct path — smooth single arc
    svgPath: 'M 25,135 C 90,115 170,75 255,28',
    summary: 'Fastest and safest. High Watch Me completion rate.',
    mapCenter: [7.318, 8.918],
    mapZoom: 11.15,
  },
  {
    id: 'r2',
    label: 'Route 2',
    via: 'Via Gwagwalada Expressway',
    distanceKm: 19.1,
    durationMin: 44,
    safetyScore: 62,
    safetyLevel: 'moderate',
    accentColor: '#f59e0b',
    isRecommended: false,
    // Dips south before rising
    svgPath: 'M 25,135 C 60,155 140,155 200,100 C 225,78 242,50 255,28',
    summary: 'Shorter distance but moderate risk near Gwagwalada junction.',
    mapCenter: [7.308, 8.912],
    mapZoom: 11.35,
  },
  {
    id: 'r3',
    label: 'Route 3',
    via: 'Via Kutunku Road',
    distanceKm: 24.8,
    durationMin: 52,
    safetyScore: 41,
    safetyLevel: 'caution',
    accentColor: '#ef4444',
    isRecommended: false,
    // Winding with two inflection points
    svgPath:
      'M 25,135 C 55,110 80,148 120,128 C 155,110 185,68 215,50 C 232,40 246,33 255,28',
    summary: 'Avoid if possible — multiple incident reports on this corridor.',
    mapCenter: [7.325, 8.922],
    mapZoom: 11.05,
  },
  {
    id: 'r4',
    label: 'Route 4',
    via: 'Via Old Abuja–Kuje Road',
    distanceKm: 28.3,
    durationMin: 61,
    safetyScore: 74,
    safetyLevel: 'moderate',
    accentColor: '#3b82f6',
    isRecommended: false,
    // Rises high (north) then drops to destination
    svgPath: 'M 25,135 C 60,55 195,48 255,28',
    summary: 'Longer but well-lit. Good fallback when Airport Road is busy.',
    mapCenter: [7.302, 8.905],
    mapZoom: 11.25,
  },
];

/** Human-readable situational copy keyed by route id. */
export const MOCK_ROUTE_INSIGHTS: Record<string, MockRouteInsight[]> = {
  r1: [
    {
      id: 'r1-i1',
      headline: 'People trust this corridor',
      body: '214 Watch Me trips were completed on Airport Road in the last 30 days — one of the highest completion rates near you.',
      tone: 'positive',
    },
    {
      id: 'r1-i2',
      headline: 'Incidents are low and fading',
      body: 'Only 3 incidents were reported along this stretch in the past month, and none in the last week.',
      tone: 'positive',
    },
    {
      id: 'r1-i3',
      headline: 'What to expect tonight',
      body: 'Under current conditions you should reach your destination in about 38 minutes. Lighting is good along the main carriageway.',
      tone: 'neutral',
    },
  ],
  r2: [
    {
      id: 'r2-i1',
      headline: 'Shorter, but busier junctions',
      body: 'Gwagwalada Expressway saves distance, but 62% of late check-ins on this route happen near the expressway merge.',
      tone: 'caution',
    },
    {
      id: 'r2-i2',
      headline: 'Community activity',
      body: '89 Watch Me trips finished here last month — enough data to trust, but fewer than Airport Road.',
      tone: 'neutral',
    },
    {
      id: 'r2-i3',
      headline: 'Timing',
      body: 'Plan for roughly 44 minutes. Traffic often stacks between 6–8 pm near the Gwagwalada interchange.',
      tone: 'neutral',
    },
  ],
  r3: [
    {
      id: 'r3-i1',
      headline: 'Higher concern on Kutunku Road',
      body: 'Several community reports mention poor lighting and slow traffic after dark. We flag this route as caution.',
      tone: 'caution',
    },
    {
      id: 'r3-i2',
      headline: 'Incident pattern',
      body: '7 incidents and 12 late check-ins were logged on this corridor in the last 30 days — above average for your area.',
      tone: 'caution',
    },
    {
      id: 'r3-i3',
      headline: 'If you must use it',
      body: 'Allow about 52 minutes and keep Watch Me contacts notified. Consider sharing live location for the full trip.',
      tone: 'neutral',
    },
  ],
  r4: [
    {
      id: 'r4-i1',
      headline: 'A solid backup route',
      body: 'Old Abuja–Kuje Road is longer but well lit. 156 successful Watch Me trips last month with few serious reports.',
      tone: 'positive',
    },
    {
      id: 'r4-i2',
      headline: 'Trade-off',
      body: 'You add roughly 9 km and 20+ minutes versus Airport Road, but avoid the busiest interchange pinch points.',
      tone: 'neutral',
    },
    {
      id: 'r4-i3',
      headline: 'Safety score in context',
      body: 'A score of 74 means “generally OK” — fine when Airport Road is congested, not our first pick late at night.',
      tone: 'neutral',
    },
  ],
};

export function getMockRouteInsights(routeId: string): MockRouteInsight[] {
  return MOCK_ROUTE_INSIGHTS[routeId] ?? MOCK_ROUTE_INSIGHTS.r1;
}

export const MOCK_COMMUNITY_MEDIA: MockMediaItem[] = [
  {
    id: 'm1',
    kind: 'video',
    title: 'Why Airport Road feels safer at night',
    subtitle: 'Community walkthrough · lighting & traffic flow',
    thumbnailUri:
      'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?w=800&q=80',
    durationLabel: '2:14',
    authorLabel: 'ResQ community',
  },
  {
    id: 'm2',
    kind: 'report',
    title: 'Market-hour slowdown near Kuje',
    subtitle: 'Expect +10 min between 5–7 pm · updated 2 hrs ago',
    thumbnailUri:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    authorLabel: '12 travellers reported',
  },
  {
    id: 'm3',
    kind: 'video',
    title: 'Dashcam: Gwagwalada merge at rush hour',
    subtitle: 'What the expressway junction looks like right now',
    thumbnailUri:
      'https://images.unsplash.com/photo-1515169067865-5387ec356754?w=800&q=80',
    durationLabel: '1:05',
    authorLabel: 'Verified member',
  },
  {
    id: 'm4',
    kind: 'photo',
    title: 'Street lighting on Old Abuja–Kuje Road',
    subtitle: 'Photo report from a Watch Me trip last night',
    thumbnailUri:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f182?w=800&q=80',
    authorLabel: 'Community photo',
  },
  {
    id: 'm5',
    kind: 'report',
    title: 'Incident cleared at Airport Road junction',
    subtitle: 'Minor fender-bender removed · lane open',
    thumbnailUri:
      'https://images.unsplash.com/photo-1544620917-041f454d1bb3?w=800&q=80',
    authorLabel: 'ResQ safety desk',
  },
];

/** Incident media for the destination check slide (Around {destination}). */
export const MOCK_DESTINATION_INCIDENT_MEDIA: MockMediaItem[] = [
  {
    id: 'di1',
    kind: 'video',
    title: 'Slow traffic near Kuje market',
    subtitle: 'Live view of the central market approach · reported 2 hrs ago',
    thumbnailUri:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    durationLabel: '0:48',
    authorLabel: 'Watch Me traveller',
  },
  {
    id: 'di2',
    kind: 'photo',
    title: 'Queue at market junction',
    subtitle: 'Photo from a community member on Airport Road turn-off',
    thumbnailUri:
      'https://images.unsplash.com/photo-1515169067865-5387ec356754?w=800&q=80',
    authorLabel: 'Community photo',
  },
  {
    id: 'di3',
    kind: 'report',
    title: 'Minor incident cleared',
    subtitle: 'Fender-bender removed — lanes open · no major obstruction',
    thumbnailUri:
      'https://images.unsplash.com/photo-1544620917-041f454d1bb3?w=800&q=80',
    authorLabel: 'ResQ safety desk',
  },
  {
    id: 'di4',
    kind: 'video',
    title: 'Junction after clearance',
    subtitle: 'Dashcam clip showing normal flow resumed',
    thumbnailUri:
      'https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?w=800&q=80',
    durationLabel: '1:12',
    authorLabel: 'Verified member',
  },
  {
    id: 'di5',
    kind: 'photo',
    title: 'Earlier security advisory area',
    subtitle: 'Authorities lifted the alert near the main junction',
    thumbnailUri:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f182?w=800&q=80',
    authorLabel: 'Updated 11 hrs ago',
  },
];

export const MOCK_DESTINATION_EVENTS: MockDestinationEvent[] = [
  {
    id: 'e1',
    title: 'Traffic build-up near Kuje market',
    detail: 'Reported slow movement near the central market — expect +10 min.',
    type: 'info',
    timeAgo: '2 hrs ago',
  },
  {
    id: 'e2',
    title: 'Minor road incident',
    detail: 'A fender-bender was cleared. No major obstruction.',
    type: 'warning',
    timeAgo: '5 hrs ago',
  },
  {
    id: 'e3',
    title: 'Security alert lifted',
    detail:
      'An earlier advisory near the junction has been lifted by authorities.',
    type: 'alert',
    timeAgo: '11 hrs ago',
  },
];

/** @deprecated Use MOCK_COMMUNITY_MEDIA */
export const MOCK_MEDIA_CARD: MockMediaItem = MOCK_COMMUNITY_MEDIA[0];
