import { supabase, isSupabaseConfigured } from './supabase';
import { AdminAnalytics } from '../types';

export const AdminService = {
  /**
   * Check if current authenticated user has the 'admin' role in PostgreSQL user_roles table
   */
  async verifyAdminRole(): Promise<{ isAdmin: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { isAdmin: false, error: 'Supabase non configuré.' };
    }

    try {
      const { data: userResp } = await supabase.auth.getUser();
      if (!userResp?.user) {
        return { isAdmin: false, error: 'Non authentifié.' };
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userResp.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;
      return { isAdmin: Boolean(data), error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de vérification des privilèges.';
      return { isAdmin: false, error: msg };
    }
  },

  /**
   * Fetch real aggregate platform analytics from v_admin_analytics view
   */
  async getAnalytics(): Promise<{ data: AdminAnalytics | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      const { data, error } = await supabase
        .from('v_admin_analytics')
        .select('*')
        .single();

      if (error) throw error;
      return { data: data as AdminAnalytics, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des analytics.';
      return { data: null, error: msg };
    }
  },
};
