import { http, HttpResponse } from "msw";
// import { tasks } from "../db";
import { db } from "../db";
import { v4 as uuid } from "uuid";

const getUserId = (req: Request) =>
  req.headers.get("Authorization")?.replace("Bearer mock-jwt-", "") ?? null;

export const taskHandlers = [
  http.get(`/projects/:id/tasks`, ({ request, params }) => {
    if (!getUserId(request))
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    let result = db.tasks.filter((t) => t.project_id === params.id);

    const status = url.searchParams.get("status");
    const assignee = url.searchParams.get("assignee");
    if (status) result = result.filter((t) => t.status === status);
    if (assignee) result = result.filter((t) => t.assignee_id === assignee);

    return HttpResponse.json({ tasks: result });
  }),

  http.post(`/projects/:id/tasks`, async ({ request, params }) => {
    if (!getUserId(request))
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = (await request.json()) as any;
    if (!body.title) {
      return HttpResponse.json(
        { error: "validation failed", fields: { title: "is required" } },
        { status: 400 },
      );
    }

    const task = {
      id: uuid(),
      title: body.title,
      description: body.description ?? "",
      status: "todo" as const,
      priority: body.priority ?? "medium",
      project_id: params.id as string,
      assignee_id: body.assignee_id,
      due_date: body.due_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.tasks.push(task);
    return HttpResponse.json(task, { status: 201 });
  }),

  http.patch(`/tasks/:id`, async ({ request, params }) => {
    if (!getUserId(request))
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const idx = db.tasks.findIndex((t) => t.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ error: "not found" }, { status: 404 });

    const body = (await request.json()) as any;
    db.tasks[idx] = {
      ...db.tasks[idx],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return HttpResponse.json(db.tasks[idx]);
  }),

  http.delete(`/tasks/:id`, ({ request, params }) => {
    if (!getUserId(request))
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });

    const idx = db.tasks.findIndex((t) => t.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ error: "not found" }, { status: 404 });

    db.tasks.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
