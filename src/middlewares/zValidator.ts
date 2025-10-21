import { Request, RequestHandler } from 'express';
import { ZodError, ZodType, infer as Infer } from 'zod';

type ReqLocation = 'body' | 'query' | 'params';

export type ValidatedFields<
  TBody extends ZodType<any, any, any> | undefined = undefined,
  TQuery = unknown,
  TParams = unknown
> = {
  body: TBody extends ZodType<any, any, any> ? Infer<TBody> : unknown;
  query: TQuery;
  params: TParams;
};

export type ReqWithValidated<
  TBody extends ZodType<any, any, any> | undefined = undefined,
  TQuery = unknown,
  TParams = unknown
> = Request & {
  validated?: ValidatedFields<TBody, TQuery, TParams>;
};

export const zValidator = <T extends Partial<Record<ReqLocation, ZodType<any, any, any>>>>(
  schemas: T
): RequestHandler => {
  return (req: Request & { validated?: Partial<Record<ReqLocation, unknown>> }, res, next) => {
    try {
      if (!req.validated) req.validated = {};

      for (const key of Object.keys(schemas) as (keyof T)[]) {
        const schema = schemas[key];
        if (schema) {
          const parsed = (schema as unknown as ZodType<any, any, any>).parse(
            req[key as ReqLocation]
          );

          // ✅ cast key to ReqLocation to fix TS error
          (req.validated as Record<ReqLocation, unknown>)[key as ReqLocation] = parsed;
        }
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        type ZodIssue = (typeof err)['issues'][number];

        const path = err.issues[0]?.path.map(String).join('.');

        return res.status(400).json({
          message: path + ': ' + err.issues[0]?.message,
          path,
          errors: err.issues.map((issue: ZodIssue) => ({
            path: issue.path.map(String).join('.'),
            message: issue.message
          }))
        });
      }
      next(err);
    }
  };
};
