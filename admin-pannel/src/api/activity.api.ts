import { ActivityItem } from '../types/analytics.types';
import { mockActivities, delay } from './mockData';

export const activityApi = {
  // Global recent activities
  getRecentActivities: async (limit: number = 6, signal?: AbortSignal): Promise<ActivityItem[]> => {
    await delay(300, signal);
    return mockActivities.slice(0, limit);
  },

  // User-dependent activities
  getUserActivities: async (userId: string, signal?: AbortSignal): Promise<ActivityItem[]> => {
    await delay(350, signal);
    const userActivities = mockActivities.filter((a) => a.userId === userId);
    
    // If no specific activity logged for user, provide standard activity logs
    if (userActivities.length === 0) {
      return [
        {
          id: `act-${userId}-1`,
          userId,
          userName: 'User Activity',
          userAvatar: '',
          action: 'Signed in from new device IP (192.168.1.10)',
          target: 'Authentication Service',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          type: 'security',
        },
        {
          id: `act-${userId}-2`,
          userId,
          userName: 'User Activity',
          userAvatar: '',
          action: 'Accessed dashboard workspace',
          target: 'Admin Console',
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          type: 'user',
        },
        {
          id: `act-${userId}-3`,
          userId,
          userName: 'User Activity',
          userAvatar: '',
          action: 'Profile credentials verified',
          target: 'Directory Services',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          type: 'system',
        },
      ];
    }

    return userActivities;
  },
};
