import { supabase, isSupabaseConfigured } from './supabase';
import { SkillExchange, ExchangeStatus, Profile } from '../types';

export interface ExchangeMatch {
  partnerProfile: Profile;
  canTeach: string[];
  wantsToLearn: string[];
}

export const SkillExchangeService = {
  /**
   * Fetch active exchanges for current user (as requester or responder)
   */
  async getMyExchanges(userId: string): Promise<{ data: SkillExchange[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('skill_exchanges')
        .select(`
          *,
          requester:profiles!skill_exchanges_requester_id_fkey(*),
          responder:profiles!skill_exchanges_responder_id_fkey(*)
        `)
        .or(`requester_user_id.eq.${userId},responder_user_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: (data as SkillExchange[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des échanges.';
      return { data: [], error: msg };
    }
  },

  /**
   * Find potential exchange matches based on user's teaching/learning skills
   */
  async findMatches(userId: string): Promise<{ data: ExchangeMatch[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      // 1. Get current user's skills
      const { data: mySkills } = await supabase
        .from('user_skills')
        .select('name, can_teach, want_to_learn')
        .eq('user_id', userId);

      const myTeaching = (mySkills || []).filter((s) => s.can_teach).map((s) => s.name.toLowerCase());
      const myLearning = (mySkills || []).filter((s) => s.want_to_learn).map((s) => s.name.toLowerCase());

      if (myTeaching.length === 0 && myLearning.length === 0) {
        return { data: [], error: null };
      }

      // 2. Query other users who can teach what I want or want to learn what I teach
      const { data: otherSkills } = await supabase
        .from('user_skills')
        .select(`
          name,
          can_teach,
          want_to_learn,
          profile:profiles(*)
        `)
        .neq('user_id', userId)
        .or('can_teach.eq.true,want_to_learn.eq.true');

      // Group by user
      const partnerMap = new Map<string, ExchangeMatch>();

      (otherSkills || []).forEach((item) => {
        const prof = item.profile as unknown as Profile;
        if (!prof || !prof.id) return;

        if (!partnerMap.has(prof.id)) {
          partnerMap.set(prof.id, {
            partnerProfile: prof,
            canTeach: [],
            wantsToLearn: [],
          });
        }

        const entry = partnerMap.get(prof.id)!;
        if (item.can_teach && myLearning.includes(item.name.toLowerCase())) {
          entry.canTeach.push(item.name);
        }
        if (item.want_to_learn && myTeaching.includes(item.name.toLowerCase())) {
          entry.wantsToLearn.push(item.name);
        }
      });

      // Filter to only those with at least one mutual match point
      const matches = Array.from(partnerMap.values()).filter(
        (m) => m.canTeach.length > 0 || m.wantsToLearn.length > 0
      );

      return { data: matches, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du calcul des correspondances.';
      return { data: [], error: msg };
    }
  },

  /**
   * Propose a new skill exchange
   */
  async createExchange(
    requesterUserId: string,
    requesterProfileId: string,
    responderProfileId: string,
    offerSkillName: string,
    requestSkillName: string,
    message?: string
  ): Promise<{ data: SkillExchange | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      // Find responder user_id
      const { data: responderProf, error: respErr } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', responderProfileId)
        .single();

      if (respErr || !responderProf) {
        throw new Error('Destinataire introuvable.');
      }

      const payload = {
        requester_id: requesterProfileId,
        responder_id: responderProfileId,
        requester_user_id: requesterUserId,
        responder_user_id: responderProf.user_id,
        offer_skill_name: offerSkillName.trim(),
        request_skill_name: requestSkillName.trim(),
        message: message ? message.trim() : null,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('skill_exchanges')
        .insert(payload)
        .select(`
          *,
          requester:profiles!skill_exchanges_requester_id_fkey(*),
          responder:profiles!skill_exchanges_responder_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      return { data: data as SkillExchange, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la proposition d’échange.';
      return { data: null, error: msg };
    }
  },

  /**
   * Update exchange status (accept, decline, cancel, complete)
   */
  async updateStatus(
    exchangeId: string,
    status: ExchangeStatus,
    responseMessage?: string
  ): Promise<{ data: SkillExchange | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      const updatePayload: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (responseMessage !== undefined) {
        updatePayload.response_message = responseMessage.trim();
      }

      const { data, error } = await supabase
        .from('skill_exchanges')
        .update(updatePayload)
        .eq('id', exchangeId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as SkillExchange, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l’échange.';
      return { data: null, error: msg };
    }
  },
};
