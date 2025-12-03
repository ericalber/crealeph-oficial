import { z } from "zod";

export const CommonEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.string().default("info"),
  REQUEST_LOG_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1)
});

export const DatabaseEnvSchema = z.object({
  DATABASE_URL: z.string().url()
});

export const RedisEnvSchema = z.object({
  REDIS_URL: z.string().url()
});

export const AuthEnvSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(8),
  NEXTAUTH_URL: z.string().url().optional(),
  AUTH_CREDENTIALS_ALLOW_INSECURE: z
    .string()
    .optional()
    .transform(v => v === "true")
    .pipe(z.boolean().default(true))
});

export const ApiEnvSchema = z.object({
  API_PORT: z.coerce.number().default(4002),
  JWT_ISSUER: z.string().default("crealeph-api"),
  JWT_AUDIENCE: z.string().default("crealeph")
});

export const WebEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_TRPC_URL: z.string().url(),
  NEXT_PUBLIC_ADMIN_URL: z.string().url(),
  NEXT_PUBLIC_WEB_URL: z.string().url()
});

export const loadEnv = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`Invalid environment, ${issues}`);
  }
  return parsed.data;
};

export const Config = {
  common: () => loadEnv(CommonEnvSchema),
  db: () => loadEnv(DatabaseEnvSchema),
  redis: () => loadEnv(RedisEnvSchema),
  auth: () => loadEnv(AuthEnvSchema),
  api: () => loadEnv(ApiEnvSchema),
  web: () => loadEnv(WebEnvSchema)
};

export type CommonEnv = z.infer<typeof CommonEnvSchema>;
export type DatabaseEnv = z.infer<typeof DatabaseEnvSchema>;
export type RedisEnv = z.infer<typeof RedisEnvSchema>;
export type AuthEnv = z.infer<typeof AuthEnvSchema>;
export type ApiEnv = z.infer<typeof ApiEnvSchema>;
export type WebEnv = z.infer<typeof WebEnvSchema>;

