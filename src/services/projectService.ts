import { Project, ProjectComment, CreateProjectInput } from '../types';

export const ProjectService = {
  /**
   * Fetch all published projects with author profiles and media (for Explorer view)
   */
  async getPublishedProjects(category?: string): Promise<{ data: Project[]; error: string | null }> {
        return { data: [], error: null };
    },

  /**
   * Fetch projects created by a specific user
   */
  async getUserProjects(userId: string): Promise<{ data: Project[]; error: string | null }> {
      return { data: [], error: null };
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
      return { data: null, error: 'Supabase non configuré.' };
  },

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<{ error: string | null }> {
      return { error: 'Supabase non configuré.' };
  },

  /**
   * Like / Unlike a project
   */
  async toggleLike(projectId: string, userId: string): Promise<{ liked: boolean; error: string | null }> {
      return { liked: false, error: 'Supabase non configuré.' };
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
      return { data: null, error: 'Supabase non configuré.' };
  },

  /**
   * Get comments for a project
   */
  async getComments(projectId: string): Promise<{ data: ProjectComment[]; error: string | null }> {
      return { data: [], error: null };
  },
};
