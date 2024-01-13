import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  BASE_URL: z.string(),
  CONFIRM_MAIL_URL: z.string(),
  DELETE_MAIL_URL: z.string(),
  RESET_PASSWORD_MAIL_URL: z.string(),
  LOGO_URL: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_REGION: z.string(),
  S3_NAME: z.string(),
  S3_BASE_URL: z.string(),
  NUMBER_RESULTS: z.coerce.number().default(6),
  FRIENDSHIP_REDIRECT_LINK: z.string(),
  GROUP_REDIRECT_LINK: z.string(),
  EVENT_REDIRECT_LINK: z.string(),
  USERS_REDIRECT_LINK: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
