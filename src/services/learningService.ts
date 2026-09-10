import { Course, Lesson, CourseEnrollment, LessonProgress, Masterclass } from '../types';

export const LearningService = {
  /**
   * Fetch all published courses with creator profile
   */
  async getPublishedCourses(category?: string): Promise<{ data: Course[]; error: string | null }> {
        return { data: [], error: null };
    },

  /**
   * Fetch a single course by ID with full modules, lessons, and current user progress
   */
  async getCourseDetail(
    courseId: string,
    userId?: string
  ): Promise<{ data: Course | null; error: string | null }> {
      return { data: null, error: null };
  },

  /**
   * Enroll in a course
   */
  async enrollInCourse(
    courseId: string,
    userId: string,
    profileId: string
  ): Promise<{ data: CourseEnrollment | null; error: string | null }> {
      return { data: null, error: 'Supabase non configuré.' };
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
      return { error: 'Supabase non configuré.' };
  },

  /**
   * Fetch all published masterclasses
   */
  async getPublishedMasterclasses(): Promise<{ data: Masterclass[]; error: string | null }> {
      return { data: [], error: null };
  },
};
