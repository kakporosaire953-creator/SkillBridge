import { AdminAnalytics } from '../types';

export const AdminService = {
  /**
   * Check if current authenticated user has the 'admin' role in PostgreSQL user_roles table
   */
  async verifyAdminRole(): Promise<{ isAdmin: boolean; error: string | null }> {
        return { isAdmin: false, error: 'Supabase non configuré.' };
    },

  /**
   * Fetch real aggregate platform analytics from v_admin_analytics view
   */
  async getAnalytics(): Promise<{ data: AdminAnalytics | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },
};
