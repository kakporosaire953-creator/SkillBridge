import { Notification } from '../types';

export const NotificationService = {
  /**
   * Fetch user notifications
   */
  async getNotifications(userId: string): Promise<{ data: Notification[]; error: string | null }> {
        return { data: [], error: null };
    },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<{ error: string | null }> {
      return { error: null };
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ error: string | null }> {
      return { error: null };
  },
};
