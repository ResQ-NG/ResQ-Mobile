import { CallAndChatBanner } from '@/components/active-sessions';

/**
 * Renders the combined floating banner when call and/or chat are minimized.
 * One card shows "Call with X" and/or "Chat with Y" so you don't see separate modals.
 */
export function InCallHost() {
  return <CallAndChatBanner />;
}
