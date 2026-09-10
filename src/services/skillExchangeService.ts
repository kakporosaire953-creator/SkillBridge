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
        return { data: [], error: null };
    },

  /**
   * Find potential exchange matches based on user's teaching/learning skills
   */
  async findMatches(userId: string): Promise<{ data: ExchangeMatch[]; error: string | null }> {
      return { data: [], error: null };
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
      return { data: null, error: 'Supabase non configuré.' };
  },

  /**
   * Update exchange status (accept, decline, cancel, complete)
   */
  async updateStatus(
    exchangeId: string,
    status: ExchangeStatus,
    responseMessage?: string
  ): Promise<{ data: SkillExchange | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },
};
