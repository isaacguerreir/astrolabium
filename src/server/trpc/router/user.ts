import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
   return ctx.prisma.user.findMany()
  })
});
