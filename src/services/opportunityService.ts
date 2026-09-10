import { Opportunity, Application, Company, CreateOpportunityInput, CreateApplicationInput } from '../types';

export const OpportunityService = {
  /**
   * Fetch all published opportunities with company profile
   */
  async getPublishedOpportunities(type?: string): Promise<{ data: Opportunity[]; error: string | null }> {
        return { data: [], error: null };
    },

  /**
   * Post a new opportunity (Companies / Mentors)
   */
  async createOpportunity(
    userId: string,
    profileId: string,
    input: CreateOpportunityInput
  ): Promise<{ data: Opportunity | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },

  /**
   * Apply to an opportunity
   */
  async applyToOpportunity(
    userId: string,
    profileId: string,
    input: CreateApplicationInput
  ): Promise<{ data: Application | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },

  /**
   * Fetch applications for current user
   */
  async getMyApplications(userId: string): Promise<{ data: Application[]; error: string | null }> {
      return { data: [], error: null };
  },

  /**
   * Fetch all companies
   */
  async getCompanies(): Promise<{ data: Company[]; error: string | null }> {
      return { data: [], error: null };
  },
};
