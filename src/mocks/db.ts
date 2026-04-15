import type { User, Project, Task } from "../types";

const users: User[] = [
  { id: "user-1", name: "Alice Johnson", email: "test@example.com" },
  { id: "user-2", name: "Bob Smith", email: "bob@example.com" },
];

const passwords: Record<string, string> = {
  "test@example.com": "password123",
  "bob@example.com": "password123",
};

const projects: Project[] = [
  {
    id: "proj-1",
    name: "Website Redesign and UX Changes",
    description: "Q2 redesign project",
    owner_id: "user-1",
    created_at: "2026-04-01T10:00:00Z",
  },
];

const tasks: Task[] = [
  {
    id: "task-1",
    title: "Design homepage",
    description: "Wireframes and mockups",
    status: "todo",
    priority: "high",
    project_id: "proj-1",
    assignee_id: "user-1",
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "task-2",
    title: "Set up CI pipeline",
    status: "in_progress",
    priority: "medium",
    project_id: "proj-1",
    assignee_id: "user-2",
    created_at: "2026-04-02T10:00:00Z",
    updated_at: "2026-04-02T10:00:00Z",
  },
  {
    id: "task-3",
    title: "Write API docs",
    status: "done",
    priority: "low",
    project_id: "proj-1",
    created_at: "2026-04-03T10:00:00Z",
    updated_at: "2026-04-05T10:00:00Z",
  },
];

export const db = { users, passwords, projects, tasks };
