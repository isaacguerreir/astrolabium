export const errorStringValidation = (msg: string) => ({ message: msg }) 
export const errorFieldValidation = (required_error: string, invalid_type_error: string) => ({ required_error, invalid_type_error })
