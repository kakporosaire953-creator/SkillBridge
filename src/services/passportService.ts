import { supabase, isSupabaseConfigured } from './supabase';
import { PassportFull, SkillPassport, Certificate } from '../types';

export const PassportService = {
  /**
   * Fetch full passport by SBID for public verification or profile display
   */
  async getPassportBySbid(sbid: string): Promise<{ data: PassportFull | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }

    try {
      const cleanSbid = sbid.trim().toUpperCase();

      // 1. Fetch from the v_passport_full view
      const { data: passportRow, error } = await supabase
        .from('v_passport_full')
        .select('*')
        .eq('sbid', cleanSbid)
        .maybeSingle();

      if (error) throw error;
      if (!passportRow) {
        return { data: null, error: 'Skill Passport introuvable ou non vérifié.' };
      }

      // 2. Fetch associated user skills
      const { data: skills } = await supabase
        .from('user_skills')
        .select(`
          *,
          proofs:skill_proofs(*)
        `)
        .eq('user_id', passportRow.id)
        .order('level', { ascending: false });

      const fullData: PassportFull = {
        ...passportRow,
        skills: skills || [],
      };

      return { data: fullData, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la vérification du passeport.';
      return { data: null, error: msg };
    }
  },

  /**
   * Fetch passport for a specific user ID
   */
  async getPassportByUserId(userId: string): Promise<{ data: SkillPassport | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('skill_passports')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return { data: data as SkillPassport | null, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement du passeport.';
      return { data: null, error: msg };
    }
  },

  /**
   * Verify certificate by certificate ID
   */
  async verifyCertificate(certId: string): Promise<{ data: Certificate | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }

    try {
      const cleanCertId = certId.trim().toUpperCase();

      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('cert_id', cleanCertId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return { data: null, error: 'Certificat introuvable.' };
      }

      return { data: data as Certificate, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la vérification du certificat.';
      return { data: null, error: msg };
    }
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
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      // Check if already issued for this course
      const { data: existing } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existing) {
        return { data: existing as Certificate, error: null };
      }

      // Generate cert id
      const certId = `SB-CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      const { data, error } = await supabase
        .from('certificates')
        .insert({
          cert_id: certId,
          user_id: userId,
          profile_id: profileId,
          course_id: courseId,
          title: courseTitle,
          issuer: 'SkillBridge Official',
          status: 'valid',
          skills: skills,
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as Certificate, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la génération du certificat.';
      return { data: null, error: msg };
    }
  },
};
