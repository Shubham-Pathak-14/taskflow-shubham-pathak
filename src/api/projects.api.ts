import { client } from "./client";
import type { Project, ProjectWithTasks } from "../types";

export const projectsApi = {
  list: () =>
    client
      .get<{ projects: Project[] }>("/projects")
      .then((r) => r.data.projects),

  get: (id: string) =>
    client.get<ProjectWithTasks>(`/projects/${id}`).then((r) => r.data),

  create: (data: { name: string; description?: string }) =>
    client.post<Project>("/projects", data).then((r) => r.data),

  update: (id: string, data: { name?: string; description?: string }) =>
    client.patch<Project>(`/projects/${id}`, data).then((r) => r.data),

  delete: (id: string) => client.delete(`/projects/${id}`),
};
