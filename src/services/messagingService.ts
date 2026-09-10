import { Conversation, Message } from '../types';

export const MessagingService = {
  /**
   * Fetch all conversations for the authenticated user
   */
  async getConversations(userId: string): Promise<{ data: Conversation[]; error: string | null }> {
        return { data: [], error: null };
    },

  /**
   * Fetch messages for a specific conversation
   */
  async getMessages(conversationId: string): Promise<{ data: Message[]; error: string | null }> {
      return { data: [], error: null };
  },

  /**
   * Send a new message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<{ data: Message | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },

  /**
   * Start or get existing conversation with a target user
   */
  async getOrCreateConversation(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ conversationId: string | null; error: string | null }> {
      return { conversationId: null, error: 'Supabase non configuré.' };
  },

  /**
   * Subscribe to real-time new messages for a conversation
   */
  subscribeToMessages(conversationId: string, onNewMessage: (msg: Message) => void) {
      return { unsubscribe: () => {} };
  },
};
