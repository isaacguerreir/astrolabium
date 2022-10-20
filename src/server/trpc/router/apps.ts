import { object, string, nativeEnum, TypeOf } from "zod";
import { Context } from '../context'
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { errorFieldValidation, errorStringValidation } from '../utils/error'
import { ApplicationType, Visibility } from '@prisma/client' 

const createAppSchema = object({
    name: string(errorFieldValidation("Name field is required.", "Invalid Type: Name could only be a string type."))
      .min(3, errorStringValidation("Name field must have at least 3 characters."))
      .max(25, errorStringValidation("Name field must have less than 25 characters.")),
    description: string()
      .min(3, errorStringValidation("Name field must have at least 3 characters."))
      .max(255, errorStringValidation("Name field must have less than 255 characters.")),
    visibility: nativeEnum(Visibility) 
  }).required()

export type CreateAppInput = TypeOf<typeof createAppSchema> 

const createApp = ({
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
        author: { connect: { id: user?.id }}
			}
		})

		console.log('APP=', app)
		return app
	}
} 

const findAll = ({
  ctx
}: {
  ctx: Context
}) => {
  return ctx.prisma.application.findMany({ include: { author: true }})
}

export const appsRouter = router({
	all: publicProcedure
    .query(findAll),
  create: protectedProcedure
    .input(createAppSchema)
    .mutation(createApp)
});
