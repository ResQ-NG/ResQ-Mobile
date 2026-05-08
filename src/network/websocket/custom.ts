import { useEffect, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';
import { logger } from '@/lib/utils/logger';
import { AppConfig } from '@/lib/app-config';
import { useAuthTokenStore } from '@/stores/auth-token-store';
import { useWebsocketStore, type WebsocketMessage } from '@/stores/websocket-store';

type UseCustomWebSocketOptions = {
  /** Defaults to `${AppConfig.BASE_URL}/ws` transformed into `ws(s)://.../ws` */
  baseUrl?: string;
  /** Overrides auth token from store */
  token?: string | null;
};

function toWebSocketBaseUrl(httpBaseUrl: string): string {
  const trimmed = httpBaseUrl.trim().replace(/\/+$/, '');
  const wsScheme = trimmed.startsWith('https://')
    ? 'wss://'
    : trimmed.startsWith('http://')
      ? 'ws://'
      : '';
  const withoutScheme = trimmed.replace(/^https?:\/\//, '');
  const base = wsScheme ? `${wsScheme}${withoutScheme}` : trimmed;
  return `${base}/ws`;
}

const DEFAULT_WS_BASE_URL = AppConfig.BASE_URL
  ? toWebSocketBaseUrl(AppConfig.BASE_URL)
  : 'ws://localhost:8080/ws';

const useCustomWebSocket = (options: UseCustomWebSocketOptions = {}) => {
  const tokenFromStore = useAuthTokenStore((s) => s.token);
  const token = options.token ?? tokenFromStore;
  const isAuthed = token != null && token !== '';

  const subscribedGroups = useWebsocketStore((s) => s.subscribedGroups);
  const pushMessage = useWebsocketStore((s) => s.pushMessage);
  const setReadyState = useWebsocketStore((s) => s.setReadyState);
  const subscribeToGroupInStore = useWebsocketStore((s) => s.subscribeToGroup);
  const setSendJsonMessage = useWebsocketStore((s) => s.setSendJsonMessage);

  const socketUrl = useMemo(() => {
    const baseUrl = options.baseUrl ?? DEFAULT_WS_BASE_URL;
    if (!token) return baseUrl;
    const sep = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${sep}token=${encodeURIComponent(token)}`;
  }, [options.baseUrl, token]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    isAuthed ? socketUrl : null,
    {
      onOpen: () => {
        logger.info('WebSocket connection established');
        for (const g of subscribedGroups) {
          sendJsonMessage({ type: 'subscribe', room: g });
        }
      },
      onClose: () => logger.info('WebSocket connection closed'),
      onError: (error) => {
        logger.error('WebSocket error', error);
      },
      shouldReconnect: () => true,
    },
    isAuthed
  );

  useEffect(() => {
    if (!isAuthed) {
      setSendJsonMessage(null);
      return;
    }
    setSendJsonMessage(() => sendJsonMessage);
    return () => setSendJsonMessage(null);
  }, [isAuthed, sendJsonMessage, setSendJsonMessage]);

  useEffect(() => {
    setReadyState(readyState);
  }, [readyState, setReadyState]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    try {
      const message = lastJsonMessage as WebsocketMessage;
      pushMessage(message);
    } catch (e) {
      logger.error('Error handling websocket message', e);
    }
  }, [lastJsonMessage, pushMessage]);

  return {
    sendMessage: (message: string) =>
      sendJsonMessage({ type: 'message', content: message }),
    subscribeToGroup: (group: string) => subscribeToGroupInStore(group),
    lastMessage: lastJsonMessage,
    readyState,
  };
};

export default useCustomWebSocket;
