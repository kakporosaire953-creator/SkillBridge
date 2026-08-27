import { supabase, isSupabaseConfigured } from './supabase';
import { UserSkill, SkillCatalogItem, SkillProof, CreateSkillInput, CreateProofInput, SkillStage } from '../types';

export const SkillService = {
  /**
   * Fetch all skills from the global catalog
   */
  async getCatalog(category?: string): Promise<{ data: SkillCatalogItem[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      let query = supabase
        .from('skill_catalog')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: (data as SkillCatalogItem[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement du catalogue.';
      return { data: [], error: msg };
    }
  },

  /**
   * Fetch user skills with their associated proofs
   */
  async getUserSkills(userId: string): Promise<{ data: UserSkill[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select(`
          *,
          proofs:skill_proofs(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: (data as UserSkill[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des compétences.';
      return { data: [], error: msg };
    }
  },

  /**
   * Add a new skill to user profile
   */
  async addUserSkill(
    userId: string,
    profileId: string,
    input: CreateSkillInput
  ): Promise<{ data: UserSkill | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      const stage = input.stage || 'declared';
      const stageLevelMap: Record<SkillStage, number> = {
        declared: 30,
        learning: 50,
        practicing: 70,
        demonstrated: 85,
        verified: 95,
      };

      const payload = {
        user_id: userId,
        profile_id: profileId,
        skill_catalog_id: input.skill_catalog_id || null,
        name: input.name.trim(),
        category: input.category || 'Technologie',
        stage: stage,
        level: input.level !== undefined ? input.level : stageLevelMap[stage],
        can_teach: Boolean(input.can_teach),
        want_to_learn: Boolean(input.want_to_learn),
      };

      const { data, error } = await supabase
        .from('user_skills')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { data: data as UserSkill, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’ajout de la compétence.';
      return { data: null, error: msg };
    }
  },

  /**
   * Update a user skill stage or level
   */
  async updateSkillStage(
    skillId: string,
    stage: SkillStage,
    customLevel?: number
  ): Promise<{ data: UserSkill | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      const stageLevelMap: Record<SkillStage, number> = {
        declared: 30,
        learning: 50,
        practicing: 70,
        demonstrated: 85,
        verified: 95,
      };

      const { data, error } = await supabase
        .from('user_skills')
        .update({
          stage,
          level: customLevel !== undefined ? customLevel : stageLevelMap[stage],
          updated_at: new Date().toISOString(),
        })
        .eq('id', skillId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as UserSkill, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la compétence.';
      return { data: null, error: msg };
    }
  },

  /**
   * Delete a user skill
   */
  async removeUserSkill(skillId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase non configuré.' };
    }

    try {
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la suppression de la compétence.';
      return { error: msg };
    }
  },

  /**
   * Add proof for a skill
   */
  async addSkillProof(
    userId: string,
    input: CreateProofInput
  ): Promise<{ data: SkillProof | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      const payload = {
        user_id: userId,
        user_skill_id: input.user_skill_id,
        title: input.title.trim(),
        url: input.url ? input.url.trim() : null,
        type: input.type,
        proof_date: input.proof_date || new Date().toISOString().split('T')[0],
        verified: false,
      };

      const { data, error } = await supabase
        .from('skill_proofs')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      // Automatically advance stage to practicing if currently declared or learning
      await supabase
        .from('user_skills')
        .update({
          stage: 'practicing',
          level: 70,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.user_skill_id)
        .in('stage', ['declared', 'learning']);

      return { data: data as SkillProof, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’ajout de la preuve.';
      return { data: null, error: msg };
    }
  },
};
