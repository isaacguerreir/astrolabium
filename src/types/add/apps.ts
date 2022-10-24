import { object, string, nativeEnum, TypeOf } from "zod";
import { Visibility } from '@prisma/client'
import { errorFieldValidation, errorStringValidation } from "../../utils/error";

export const createAppSchema = object({
    name: string(errorFieldValidation("Name field is required.", "Invalid Type: Name could only be a string type."))
      .min(3, errorStringValidation("Name field must have at least 3 characters."))
      .max(25, errorStringValidation("Name field must have less than 25 characters.")),
    description: string()
      .min(3, errorStringValidation("Name field must have at least 3 characters."))
      .max(255, errorStringValidation("Name field must have less than 255 characters.")),
    url: string()
      .url(errorStringValidation("This field is an invalid URL.")),
    appName: string(errorFieldValidation("Application Name field is required.", "Invalid Type: Application Name could only be a string type."))
      .min(3, errorStringValidation("Name field must have at least 3 characters.")),
    component: string(errorFieldValidation("Component field is required.", "Invalid Type: Component could only be a string type."))
      .min(3, errorStringValidation("Name field must have at least 3 characters.")),
    visibility: nativeEnum(Visibility) 
  }).required()

export type CreateAppInput = TypeOf<typeof createAppSchema>
