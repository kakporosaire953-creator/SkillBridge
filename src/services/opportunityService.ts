import { supabase, isSupabaseConfigured } from './supabase';
import { Opportunity, Application, Company, CreateOpportunityInput, CreateApplicationInput } from '../types';

export const OpportunityService = {
  /**
   * Fetch all published opportunities with company profile
   */
  async getPublishedOpportunities(type?: string): Promise<{ data: Opportunity[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      let query = supabase
        .from('opportunities')
        .select(`
          *,
          company:companies(*),
          creator:profiles(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (type && type !== 'all') {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: (data as Opportunity[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des opportunités.';
      return { data: [], error: msg };
    }
  },

  /**
   * Post a new opportunity (Companies / Mentors)
   */
  async createOpportunity(
    userId: string,
    profileId: string,
    input: CreateOpportunityInput
  ): Promise<{ data: Opportunity | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    if (!input.title || input.title.trim().length === 0) {
      return { data: null, error: 'Le titre est obligatoire.' };
    }

    if (!input.description || input.description.trim().length === 0) {
      return { data: null, error: 'La description est obligatoire.' };
    }

    try {
      const payload = {
        user_id: userId,
        creator_id: profileId,
        company_id: input.company_id || null,
        title: input.title.trim(),
        description: input.description.trim(),
        type: input.type,
        location: input.location ? input.location.trim() : null,
        workplace_type: input.workplace_type || 'onsite',
        required_skills: input.required_skills || [],
        level: input.level || null,
        salary_min: input.salary_min || null,
        salary_max: input.salary_max || null,
        currency: input.currency || 'XOF',
        deadline: input.deadline || null,
        status: 'published',
      };

      const { data, error } = await supabase
        .from('opportunities')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Opportunity, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la publication de l’opportunité.';
      return { data: null, error: msg };
    }
  },

  /**
   * Apply to an opportunity
   */
  async applyToOpportunity(
    userId: string,
    profileId: string,
    input: CreateApplicationInput
  ): Promise<{ data: Application | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      const payload = {
        opportunity_id: input.opportunity_id,
        user_id: userId,
        applicant_id: profileId,
        cover_message: input.cover_message ? input.cover_message.trim() : null,
        passport_sbid: input.passport_sbid || null,
        status: 'submitted',
      };

      const { data, error } = await supabase
        .from('applications')
        .insert(payload)
        .select(`
          *,
          opportunity:opportunities(*)
        `)
        .single();

      if (error) throw error;
      return { data: data as Application, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’envoi de la candidature.';
      return { data: null, error: msg };
    }
  },

  /**
   * Fetch applications for current user
   */
  async getMyApplications(userId: string): Promise<{ data: Application[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities(
            *,
            company:companies(*)
          )
        `)
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return { data: (data as Application[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des candidatures.';
      return { data: [], error: msg };
    }
  },

  /**
   * Fetch all companies
   */
  async getCompanies(): Promise<{ data: Company[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) throw error;
      return { data: (data as Company[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des entreprises.';
      return { data: [], error: msg };
    }
  },
};
