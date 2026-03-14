import { InChatBanner } from './InChatBanner';

/**
 * Renders the floating in-chat banner when a chat is active and the chat screen is not open.
 * The chat UI is a modal screen at (modals)/chat. Mount this once in the app root.
 */
export function InChatHost() {
  return <InChatBanner />;
}
