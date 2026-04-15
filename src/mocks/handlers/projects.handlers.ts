import { http, HttpResponse } from "msw";
import { db } from "../db";
import { v4 as uuid } from "uuid";

const getUserIdFromToken = (request: Request): string | null => {
  const auth = request.headers.get("Authorization");
  if (!auth) return null;
  return auth.replace("Bearer mock-jwt-", "");
};

export const projectHandlers = [
  http.get("/projects", ({ request }) => {
    const userId = getUserIdFromToken(request);
    if (!userId)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const accessible = db.projects.filter(
      (p) =>
        p.owner_id === userId ||
        db.tasks.some(
          (task) => task.project_id === p.id && task.assignee_id === userId,
        ),
    );
    return HttpResponse.json({ projects: accessible });
  }),

  http.post("/projects", async ({ request }) => {
    const userId = getUserIdFromToken(request);
    if (!userId)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = (await request.json()) as any;
    if (!body.name) {
      return HttpResponse.json(
        { error: "validation failed", fields: { name: "is required" } },
        { status: 400 },
      );
    }

    const project = {
      id: uuid(),
      name: body.name,
      description: body.description ?? "",
      owner_id: userId,
      created_at: new Date().toISOString(),
    };

    db.projects.push(project);
    return HttpResponse.json(project, { status: 201 });
  }),

  http.get("/projects/:id", ({ request, params }) => {
    const userId = getUserIdFromToken(request);
    if (!userId)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const project = db.projects.find((p) => p.id === params.id);
    if (!project)
      return HttpResponse.json({ error: "not found" }, { status: 404 });

    const projectTasks = db.tasks.filter((t) => t.project_id === params.id);
    return HttpResponse.json({ ...project, tasks: projectTasks });
  }),

  http.patch("/projects/:id", async ({ request, params }) => {
    const userId = getUserIdFromToken(request);
    if (!userId)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const idx = db.projects.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    if (db.projects[idx].owner_id !== userId)
      return HttpResponse.json({ error: "forbidden" }, { status: 403 });

    const body = (await request.json()) as any;
    db.projects[idx] = { ...db.projects[idx], ...body };
    return HttpResponse.json(db.projects[idx]);
  }),

  http.delete("/projects/:id", ({ request, params }) => {
    const userId = getUserIdFromToken(request);
    if (!userId)
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const idx = db.projects.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    if (db.projects[idx].owner_id !== userId)
      return HttpResponse.json({ error: "forbidden" }, { status: 403 });

    db.projects.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
