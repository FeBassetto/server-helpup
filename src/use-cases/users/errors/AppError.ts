interface CustomError {
  code: number
  message: string
}

export class AppError extends Error implements CustomError {
  code: number

  constructor({ code, message }: CustomError) {
    super(message)
    this.name = 'CustomError'
    this.code = code
  }
}
