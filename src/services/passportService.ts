import { PassportFull, SkillPassport, Certificate } from '../types';

export const PassportService = {
  /**
   * Fetch full passport by SBID for public verification or profile display
   */
  async getPassportBySbid(sbid: string): Promise<{ data: PassportFull | null; error: string | null }> {
        return { data: null, error: null };
    },

  /**
   * Fetch passport for a specific user ID
   */
  async getPassportByUserId(userId: string): Promise<{ data: SkillPassport | null; error: string | null }> {
      return { data: null, error: null };
  },

  /**
   * Verify certificate by certificate ID
   */
  async verifyCertificate(certId: string): Promise<{ data: Certificate | null; error: string | null }> {
      return { data: null, error: null };
  },

  /**
   * Issue a certificate upon course completion
   */
  async issueCertificate(
    userId: string,
    profileId: string,
    courseId: string,
    courseTitle: string,
    skills: string[]
  ): Promise<{ data: Certificate | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
  },
};
