import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useCustomWebSocket from '@/network/websocket';
import { useWebsocketStore } from '@/stores/websocket-store';
import { messageKey } from '@/network/websocket/handlers/message-key';
import { runRealtimeHandlers } from '@/network/websocket/handlers/realtime-handlers';
import { runCoreSideEffects } from '@/network/websocket/handlers/core-side-effects';

export function WebsocketEventHandler() {
  // Ensure WS connection is mounted once at app root.
  useCustomWebSocket();

  const lastMessage = useWebsocketStore((s) => s.lastMessage);
  const handledKeyRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!lastMessage) return;
    const key = messageKey(lastMessage);
    if (handledKeyRef.current === key) return;
    handledKeyRef.current = key;

    runRealtimeHandlers(queryClient, lastMessage);
    runCoreSideEffects(lastMessage);
  }, [lastMessage, queryClient]);

  return null;
}
