export interface CreateWatchMeRequest {
  origin_lat: number;
  origin_lng: number;
  destination_lat: number;
  destination_lng: number;
  transport_mode: string;
  eta: number;
  contact_ids: string[];
}

export interface WatchMeSessionForUserWatching {
  contact: {
    email: string;
    full_name: string;
    phone_number: string;
  };
  traveler: {
    avatar_url: string;
  };
  watch_me: {
    status: string;
    transport_mode_name: string;
    last_signal_at: string;
    last_location: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface FetchUserActiveWatchResponse {
  is_contact_in_active_session: boolean;
  sessions: WatchMeSessionForUserWatching[];
}
