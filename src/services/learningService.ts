import { supabase, isSupabaseConfigured } from './supabase';
import { Course, Lesson, CourseEnrollment, LessonProgress, Masterclass } from '../types';

export const LearningService = {
  /**
   * Fetch all published courses with creator profile
   */
  async getPublishedCourses(category?: string): Promise<{ data: Course[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      let query = supabase
        .from('courses')
        .select(`
          *,
          creator:profiles(*),
          modules:course_modules(
            *,
            lessons(*)
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (category && category !== 'Tous') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: (data as Course[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des cours.';
      return { data: [], error: msg };
    }
  },

  /**
   * Fetch a single course by ID with full modules, lessons, and current user progress
   */
  async getCourseDetail(
    courseId: string,
    userId?: string
  ): Promise<{ data: Course | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: null };
    }

    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select(`
          *,
          creator:profiles(*),
          modules:course_modules(
            *,
            lessons(*)
          )
        `)
        .eq('id', courseId)
        .single();

      if (error) throw error;

      // If user is logged in, attach their enrollment & lesson progress
      if (userId && course) {
        const { data: enrollment } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', userId)
          .maybeSingle();

        const { data: progressList } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('course_id', courseId)
          .eq('user_id', userId);

        const progressMap = new Map((progressList || []).map((p) => [p.lesson_id, p]));

        // Attach progress to each lesson
        if (course.modules) {
          course.modules.forEach((mod: { lessons?: Lesson[] }) => {
            if (mod.lessons) {
              mod.lessons.forEach((l: Lesson) => {
                l.progress = progressMap.get(l.id) as unknown as LessonProgress | undefined;
              });
            }
          });
        }

        course.my_enrollment = enrollment as unknown as CourseEnrollment | undefined;
      }

      return { data: course as Course, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement du cours.';
      return { data: null, error: msg };
    }
  },

  /**
   * Enroll in a course
   */
  async enrollInCourse(
    courseId: string,
    userId: string,
    profileId: string
  ): Promise<{ data: CourseEnrollment | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: 'Supabase non configuré.' };
    }

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          user_id: userId,
          profile_id: profileId,
          status: 'active',
          progress_pct: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return { data: data as CourseEnrollment, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de l’inscription au cours.';
      return { data: null, error: msg };
    }
  },

  /**
   * Mark a lesson as completed
   */
  async completeLesson(
    userId: string,
    lessonId: string,
    courseId: string,
    timeSpentSeconds: number = 60
  ): Promise<{ error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase non configuré.' };
    }

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: userId,
            lesson_id: lessonId,
            course_id: courseId,
            completed: true,
            completed_at: new Date().toISOString(),
            time_spent_seconds: timeSpentSeconds,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde de la progression.';
      return { error: msg };
    }
  },

  /**
   * Fetch all published masterclasses
   */
  async getPublishedMasterclasses(): Promise<{ data: Masterclass[]; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('masterclasses')
        .select(`
          *,
          creator:profiles(*)
        `)
        .eq('status', 'published')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      return { data: (data as Masterclass[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du chargement des masterclasses.';
      return { data: [], error: msg };
    }
  },
};
