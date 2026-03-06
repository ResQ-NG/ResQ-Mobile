// import * as Sentry from '@sentry/nextjs'

//i am abstracting the logger here. incase we need to use a third party system later we can easily have an overall global config for logging without having to touch everywhere on the codebase. this would also hide console.log from production environment
const isProd = process.env.NODE_ENV === "production";

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProd) {
      console.debug(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (!isProd) {
      console.warn(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (!isProd) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (!isProd) {
      console.error(...args);
    }
  },
};

/**
 * basic util for handling errors both on prod and sentry
 * @param error
 * @param operationName
 * @param context
 */
export const logError = (
  error: unknown,
  operationName: string,
  context: Record<string, unknown>
) => {
  //   Sentry.withScope((scope) => {
  //     scope.setTag('operation', operationName)
  //     scope.setContext('operationDetails', context)
  //     Sentry.captureException(error)
  //   })
  logger.error(
    `Error in operation: ${operationName}`,
    error,
    error instanceof Error ? error.stack : undefined,
    context
  );
};
