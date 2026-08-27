import { supabase, isSupabaseConfigured } from './supabase';
import { Project, ProjectComment, CreateProjectInput } from '../types';

export const ProjectService = {
  /**
   * Fetch all published projects with author profiles and media (for Explorer view)
   */
  async getPublishedProjects(category?: string): Promise<{ data: Project[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          author:profiles(*),
          media:project_media(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (category && category !== 'Tous') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: (data as Project[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des projets.';
      return { data: [], error: msg };
    }
  },

  /**
   * Fetch projects created by a specific user
   */
  async getUserProjects(userId: string): Promise<{ data: Project[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          media:project_media(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: (data as Project[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des projets utilisateur.';
      return { data: [], error: msg };
    }
  },

  /**
   * Create a new project
   */
  async createProject(
    userId: string,
    profileId: string,
    input: CreateProjectInput,
    mediaUrls?: { url: string; type: 'image' | 'video' }[]
  ): Promise<{ data: Project | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    if (!input.title || input.title.trim().length === 0) {
      return { data: null, error: 'Le titre du projet est obligatoire.' };
    }

    if (!input.description || input.description.trim().length === 0) {
      return { data: null, error: 'La description du projet est obligatoire.' };
    }

    try {
      const payload = {
        user_id: userId,
        author_id: profileId,
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category || 'Technologie',
        technologies: input.technologies || [],
        skills_used: input.skills_used || [],
        role: input.role || null,
        github_url: input.github_url || null,
        live_url: input.live_url || null,
        video_url: input.video_url || null,
        status: input.status || 'published',
        project_date: input.project_date || new Date().toISOString().split('T')[0],
      };

      const { data: project, error: projError } = await supabase
        .from('projects')
        .insert(payload)
        .select()
        .single();

      if (projError) throw projError;

      // Insert media if provided
      if (mediaUrls && mediaUrls.length > 0 && project) {
        const mediaPayload = mediaUrls.map((m, idx) => ({
          project_id: project.id,
          user_id: userId,
          url: m.url,
          type: m.type,
          display_order: idx,
        }));

        await supabase.from('project_media').insert(mediaPayload);
      }

      return { data: project as Project, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création du projet.';
      return { data: null, error: msg };
    }
  },

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase non configuré.' };
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la suppression du projet.';
      return { error: msg };
    }
  },

  /**
   * Like / Unlike a project
   */
  async toggleLike(projectId: string, userId: string): Promise<{ liked: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { liked: false, error: 'Supabase non configuré.' };
    }

    try {
      // Check if already liked
      const { data: existing } = await supabase
        .from('project_likes')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Unlike
        await supabase.from('project_likes').delete().eq('id', existing.id);
        return { liked: false, error: null };
      } else {
        // Like
        await supabase.from('project_likes').insert({ project_id: projectId, user_id: userId });
        return { liked: true, error: null };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’interaction.';
      return { liked: false, error: msg };
    }
  },

  /**
   * Add a comment to a project
   */
  async addComment(
    projectId: string,
    userId: string,
    profileId: string,
    content: string
  ): Promise<{ data: ProjectComment | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    if (!content || content.trim().length === 0) {
      return { data: null, error: 'Le commentaire ne peut pas être vide.' };
    }

    try {
      const { data, error } = await supabase
        .from('project_comments')
        .insert({
          project_id: projectId,
          user_id: userId,
          author_id: profileId,
          content: content.trim(),
        })
        .select(`
          *,
          author:profiles(*)
        `)
        .single();

      if (error) throw error;
      return { data: data as ProjectComment, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’envoi du commentaire.';
      return { data: null, error: msg };
    }
  },

  /**
   * Get comments for a project
   */
  async getComments(projectId: string): Promise<{ data: ProjectComment[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('project_comments')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data: (data as ProjectComment[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des commentaires.';
      return { data: [], error: msg };
    }
  },
};
