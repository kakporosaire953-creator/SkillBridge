import { UserSkill, SkillCatalogItem, SkillProof, CreateSkillInput, CreateProofInput, SkillStage } from '../types';

export const SkillService = {
  /**
   * Fetch all skills from the global catalog
   */
  async getCatalog(category?: string): Promise<{ data: SkillCatalogItem[]; error: string | null }> {
        return { data: [], error: null };
    },

  /**
   * Fetch user skills with their associated proofs
   */
  async getUserSkills(userId: string): Promise<{ data: UserSkill[]; error: string | null }> {
      return { data: [], error: null };
  },

  /**
   * Add a new skill to user profile
   */
  async addUserSkill(
    userId: string,
    profileId: string,
    input: CreateSkillInput
  ): Promise<{ data: UserSkill | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },

  /**
   * Update a user skill stage or level
   */
  async updateSkillStage(
    skillId: string,
    stage: SkillStage,
    customLevel?: number
  ): Promise<{ data: UserSkill | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },

  /**
   * Delete a user skill
   */
  async removeUserSkill(skillId: string): Promise<{ error: string | null }> {
      return { error: 'Supabase non configuré.' };
  },

  /**
   * Add proof for a skill
   */
  async addSkillProof(
    userId: string,
    input: CreateProofInput
  ): Promise<{ data: SkillProof | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },
};
