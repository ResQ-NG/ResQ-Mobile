import type { WebsocketMessage } from '@/stores/websocket-store';

export function messageKey(m: WebsocketMessage): string {
  return `${m.timestamp ?? '0'}|${m.type ?? ''}|${m.event ?? ''}`;
}

