import { http, HttpResponse } from "msw";
import { db } from "../db";
import { v4 as uuid } from "uuid";

export const authHandlers = [
  http.post("/auth/register", async ({ request }) => {
    const body = (await request.json()) as any;

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        { error: "validation failed", fields: { email: "is required" } },
        { status: 400 },
      );
    }

    if (db.users.find((u) => u.email === body.email)) {
      return HttpResponse.json(
        { error: "validation failed", fields: { email: "already exists" } },
        { status: 400 },
      );
    }

    const newUser = { id: uuid(), name: body.name, email: body.email };
    db.users.push(newUser);
    db.passwords[body.email] = body.password;

    return HttpResponse.json(
      { token: `mock-jwt-${newUser.id}`, user: newUser },
      { status: 201 },
    );
  }),

  http.post("/auth/login", async ({ request }) => {
    const body = (await request.json()) as any;
    const user = db.users.find((u) => u.email === body.email);

    if (!user || db.passwords[body.email] !== body.password) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    return HttpResponse.json({
      token: `mock-jwt-${user.id}`,
      user,
    });
  }),
];
