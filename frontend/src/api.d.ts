// src/api.d.ts
interface Activity {
    id: number;
    title: string;
    description: string;
}

export const getAllActivities: () => Promise<Activity[]>;
export const getActivityById: (id: number) => Promise<Activity>;
export const addActivity: (activity: { title: string; description: string }) => Promise<Activity>;
export const updateActivityById: (id: number, activity: { title: string; description: string }) => Promise<Activity>;
export const deleteActivityById: (id: number) => Promise<void>;
