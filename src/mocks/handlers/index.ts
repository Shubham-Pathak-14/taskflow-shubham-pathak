import { authHandlers } from "./auth.handlers";
import { projectHandlers } from "./projects.handlers";
import { taskHandlers } from "./tasks.handlers";

export const handlers = [...authHandlers, ...projectHandlers, ...taskHandlers];
