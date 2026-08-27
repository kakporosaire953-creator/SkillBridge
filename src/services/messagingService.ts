import { supabase, isSupabaseConfigured } from './supabase';
import { Conversation, Message } from '../types';

export const MessagingService = {
  /**
   * Fetch all conversations for the authenticated user
   */
  async getConversations(userId: string): Promise<{ data: Conversation[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      // 1. Get conversation IDs the user participates in
      const { data: participations, error: partErr } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', userId);

      if (partErr) throw partErr;
      if (!participations || participations.length === 0) {
        return { data: [], error: null };
      }

      const convIds = participations.map((p) => p.conversation_id);

      // 2. Fetch conversations with all participants
      const { data: convs, error: convErr } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants(
            user_id,
            profile:profiles(*)
          ),
          messages:messages(
            id,
            content,
            created_at,
            sender_id,
            is_read
          )
        `)
        .in('id', convIds)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (convErr) throw convErr;

      // Transform and identify other participant & last message
      const formatted = (convs || []).map((c: any) => {
        const otherParticipant = c.participants?.find((p: any) => p.user_id !== userId)?.profile;
        const messages = c.messages || [];
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
        const unreadCount = messages.filter((m: any) => m.sender_id !== userId && !m.is_read).length;

        return {
          id: c.id,
          created_by: c.created_by,
          last_message_at: c.last_message_at,
          created_at: c.created_at,
          other_participant: otherParticipant,
          last_message: lastMessage,
          unread_count: unreadCount,
        } as Conversation;
      });

      return { data: formatted, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des conversations.';
      return { data: [], error: msg };
    }
  },

  /**
   * Fetch messages for a specific conversation
   */
  async getMessages(conversationId: string): Promise<{ data: Message[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(*)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data: (data as Message[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des messages.';
      return { data: [], error: msg };
    }
  },

  /**
   * Send a new message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<{ data: Message | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    if (!content || content.trim().length === 0) {
      return { data: null, error: 'Le message ne peut pas être vide.' };
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: content.trim(),
        })
        .select(`
          *,
          sender:profiles(*)
        `)
        .single();

      if (error) throw error;
      return { data: data as Message, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’envoi du message.';
      return { data: null, error: msg };
    }
  },

  /**
   * Start or get existing conversation with a target user
   */
  async getOrCreateConversation(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ conversationId: string | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { conversationId: null, error: 'Supabase non configuré.' };
    }

    try {
      // Find mutual conversation
      const { data: myConvs } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);

      const convIds = (myConvs || []).map((c) => c.conversation_id);

      if (convIds.length > 0) {
        const { data: targetMatch } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', targetUserId)
          .in('conversation_id', convIds)
          .maybeSingle();

        if (targetMatch) {
          return { conversationId: targetMatch.conversation_id, error: null };
        }
      }

      // Create new conversation
      const { data: newConv, error: createErr } = await supabase
        .from('conversations')
        .insert({ created_by: currentUserId })
        .select()
        .single();

      if (createErr || !newConv) throw createErr;

      // Add both participants
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: currentUserId },
        { conversation_id: newConv.id, user_id: targetUserId },
      ]);

      return { conversationId: newConv.id, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création de la discussion.';
      return { conversationId: null, error: msg };
    }
  },

  /**
   * Subscribe to real-time new messages for a conversation
   */
  subscribeToMessages(conversationId: string, onNewMessage: (msg: Message) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch sender profile details
          const { data: senderProf } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', payload.new.sender_id)
            .maybeSingle();

          const messageWithSender: Message = {
            ...(payload.new as Message),
            sender: senderProf || undefined,
          };

          onNewMessage(messageWithSender);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};
