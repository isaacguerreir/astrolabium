import { ApplicationType, Prisma } from '@prisma/client' 
import { object, string, TypeOf } from "zod";
import { Context } from '../context'
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { createAppSchema, CreateAppInput } from "../../../types/add/apps";
import { nameToPath } from '../../../utils/string';
import { TRPCError } from '@trpc/server';

const deleteAppSchema = object({
  id: string()
}) 

export type DeleteAppInput = TypeOf<typeof deleteAppSchema>

const create = async ({
  input,
  ctx
}: {
  input: CreateAppInput,
  ctx: Context
}) => {
	const user = ctx.session?.user 
  try {
    if (user) {
      const app = await ctx.prisma.application.create({
        data: {
          id: nameToPath(input.name),
          name: input.name,
          description: input.description,
          visibility: input.visibility,
          type: ApplicationType.VIEWER,
          url: input.url,
          author: { connect: { id: user?.id }}
        }
      })

      return app
    }
		throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User do not exist.',
    });
  } catch(err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'The application name should be unique. Try again with a different name.'
        });

      }
    }
  }
} 

const all = async ({
  ctx
}: {
  ctx: Context
}) => {
  return await ctx.prisma.application.findMany({ include: { author: true }})
}

// TODO: Use detele all instead of only delete
const remove = ({
  input,
  ctx
}: {
  input: DeleteAppInput,
  ctx: Context
}) => {
		const app = ctx.prisma.application.delete({
      where: {
        id: input.id
      }
    })

		console.log('APP=', app)
		return app
}


export const appsRouter = router({
	all: publicProcedure
    .query(all),
  create: protectedProcedure
    .input(createAppSchema)
    .mutation(create),
  remove: publicProcedure
    .input(deleteAppSchema)
    .mutation(remove)
});
