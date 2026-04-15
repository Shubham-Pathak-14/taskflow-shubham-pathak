import { client } from "./client";
import type { Task, TaskStatus } from "../types";

export const tasksApi = {
  list: (
    projectId: string,
    filters?: { status?: TaskStatus; assignee?: string },
  ) =>
    client
      .get<{
        tasks: Task[];
      }>(`/projects/${projectId}/tasks`, { params: filters })
      .then((r) => r.data.tasks),

  create: (projectId: string, data: Partial<Task>) =>
    client.post<Task>(`/projects/${projectId}/tasks`, data).then((r) => r.data),

  update: (id: string, data: Partial<Task>) =>
    client.patch<Task>(`/tasks/${id}`, data).then((r) => r.data),

  delete: (id: string) => client.delete(`/tasks/${id}`),
};
