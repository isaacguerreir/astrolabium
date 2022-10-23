import { ApplicationType } from '@prisma/client' 
import { object, string, TypeOf } from "zod";
import { Context } from '../context'
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { createAppSchema, CreateAppInput } from "../../../types/add/apps";
import { errorStringValidation } from '../../../utils/error';

const deleteAppSchema = object({
  id: string().uuid(errorStringValidation('Field id must be of type uuid'))
}) 

export type DeleteAppInput = TypeOf<typeof deleteAppSchema>

const create = ({
  input,
  ctx
}: {
  input: CreateAppInput,
  ctx: Context
}) => {
	const user = ctx.session?.user 
	if (user) {
		const app = ctx.prisma.application.create({
			data: {
				name: input.name,
				description: input.description,
				visibility: input.visibility,
				type: ApplicationType.VIEWER,
        url: input.url,
        author: { connect: { id: user?.id }}
			}
		})

		console.log('APP=', app)
		return app
	}
} 

const all = ({
  ctx
}: {
  ctx: Context
}) => {
  return ctx.prisma.application.findMany({ include: { author: true }})
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
