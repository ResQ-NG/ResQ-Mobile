export type WatchStatus = 'safe' | 'en_route' | 'overdue';

/** [longitude, latitude] for map display */
export type MapCoordinate = [number, number];

export type ActiveWatch = {
  id: string;
  name: string;
  lastCheckLabel: string;
  status: WatchStatus;
  avatarBgIndex?: number;
  destination?: string;
  lastOkayAt?: string;
  isMoving?: boolean;
  batteryPercent?: number;
  deviceInfo?: string;
  /** When true, this contact's Watch Me is visible on the map; list shows "On map" and tap focuses map on them */
  availableOnMap?: boolean;
  /** Location used for map marker and focus (required when availableOnMap is true) */
  coordinates?: MapCoordinate;
};

/** Mock coordinates near Lagos (longitude, latitude) */
const LAGOS = [3.3792, 6.5244] as const;

export const ACTIVE_WATCHES_MOCK: ActiveWatch[] = [
  {
    id: '1',
    name: 'Mum',
    lastCheckLabel: '3 mins ago',
    status: 'safe',
    avatarBgIndex: 0,
    destination: 'Lekki Phase 1, Lagos',
    lastOkayAt: '3 mins ago',
    isMoving: true,
    batteryPercent: 87,
    deviceInfo: 'iPhone 15 • iOS 17.2',
    availableOnMap: true,
    coordinates: [LAGOS[0] + 0.02, LAGOS[1] + 0.01],
  },
  {
    id: '2',
    name: 'Brother Tunde',
    lastCheckLabel: '7 mins ago',
    status: 'en_route',
    avatarBgIndex: 1,
    destination: 'Victoria Island',
    lastOkayAt: '7 mins ago',
    isMoving: true,
    batteryPercent: 42,
    deviceInfo: 'Samsung Galaxy S24 • Android 14',
    availableOnMap: true,
    coordinates: [LAGOS[0] - 0.015, LAGOS[1] - 0.02],
  },
  {
    id: '3',
    name: 'LizBee',
    lastCheckLabel: '12 mins ago',
    status: 'safe',
    avatarBgIndex: 2,
    destination: 'Ikeja GRA',
    lastOkayAt: '12 mins ago',
    isMoving: false,
    batteryPercent: 91,
    deviceInfo: 'iPhone 14 Pro • iOS 17.2',
    availableOnMap: true,
    coordinates: [LAGOS[0] + 0.01, LAGOS[1] - 0.015],
  },
  {
    id: '4',
    name: 'Adebayo',
    lastCheckLabel: '1 min ago',
    status: 'safe',
    avatarBgIndex: 3,
    destination: 'Ajah',
    lastOkayAt: '1 min ago',
    isMoving: true,
    batteryPercent: 78,
    deviceInfo: 'Pixel 8 • Android 14',
    availableOnMap: true,
    coordinates: [LAGOS[0] + 0.03, LAGOS[1] - 0.01],
  },
  {
    id: '5',
    name: 'Chioma',
    lastCheckLabel: '18 mins ago',
    status: 'overdue',
    avatarBgIndex: 4,
    destination: 'Yaba',
    lastOkayAt: '45 mins ago',
    isMoving: false,
    batteryPercent: 12,
    deviceInfo: 'iPhone 13 • iOS 16.6',
    availableOnMap: false,
  },
  {
    id: '6',
    name: 'Emeka',
    lastCheckLabel: '5 mins ago',
    status: 'en_route',
    avatarBgIndex: 5,
    destination: 'Surulere',
    lastOkayAt: '5 mins ago',
    isMoving: true,
    batteryPercent: 65,
    deviceInfo: 'OnePlus 11 • Android 13',
    availableOnMap: true,
    coordinates: [LAGOS[0] - 0.025, LAGOS[1] + 0.02],
  },
  {
    id: '7',
    name: 'Funke',
    lastCheckLabel: '22 mins ago',
    status: 'safe',
    avatarBgIndex: 6,
    destination: 'Ikorodu',
    lastOkayAt: '22 mins ago',
    isMoving: false,
    batteryPercent: 94,
    deviceInfo: 'Samsung A54 • Android 14',
    availableOnMap: true,
    coordinates: [LAGOS[0] + 0.04, LAGOS[1] + 0.03],
  },
  {
    id: '8',
    name: 'Uncle Segun',
    lastCheckLabel: '9 mins ago',
    status: 'safe',
    avatarBgIndex: 7,
    destination: 'Ikeja',
    lastOkayAt: '9 mins ago',
    isMoving: true,
    batteryPercent: 56,
    deviceInfo: 'iPhone 12 • iOS 17.1',
    availableOnMap: false,
  },
];

export function getStatusBadgeBg(status: WatchStatus): string {
  return status === 'safe' ? '#16A34A' : status === 'overdue' ? '#DC2626' : '#F59E0B';
}

export function getStatusBadgeLabel(status: WatchStatus): string {
  return status === 'safe' ? 'Safe' : status === 'en_route' ? 'On route' : 'Overdue';
}
