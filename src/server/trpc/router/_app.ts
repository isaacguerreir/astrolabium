// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { appsRouter } from './apps' 
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  apps: appsRouter, 
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
