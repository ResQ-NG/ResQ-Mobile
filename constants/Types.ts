export interface MediaContent {
    type: 'text' | 'voice' | 'camera' | 'previous' | null;
    url?: string;
    text?: string;
    timestamp: number;
  }
