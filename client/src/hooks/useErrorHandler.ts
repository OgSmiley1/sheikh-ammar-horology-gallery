import { useCallback } from "react";

interface ErrorContext {
  component: string;
  action?: string;
  context?: Record<string, any>;
}

/**
 * Hook for handling errors with context
 * Logs errors to session storage for debugging
 */
export function useErrorHandler(componentName: string) {
  const handleError = useCallback(
    (error: Error | unknown, context?: ErrorContext) => {
      const errorData = {
        component: context?.component || componentName,
        action: context?.action,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        context: context?.context,
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      };

      // Log to session storage
      try {
        const errors = JSON.parse(sessionStorage.getItem("component_errors") || "[]");
        errors.push(errorData);
        // Keep only last 20 errors
        if (errors.length > 20) errors.shift();
        sessionStorage.setItem("component_errors", JSON.stringify(errors));
      } catch (e) {
        // Silently fail if storage is unavailable
      }

      // Log in development
      if (process.env.NODE_ENV === "development") {
        console.error(`[${componentName}]`, errorData);
      }

      return errorData;
    },
    [componentName]
  );

  const getStoredErrors = useCallback(() => {
    try {
      return JSON.parse(sessionStorage.getItem("component_errors") || "[]");
    } catch {
      return [];
    }
  }, []);

  const clearErrors = useCallback(() => {
    try {
      sessionStorage.removeItem("component_errors");
    } catch {
      // Silently fail
    }
  }, []);

  return { handleError, getStoredErrors, clearErrors };
}

/**
 * Error recovery strategies
 */
export const ErrorRecovery = {
  /**
   * Retry with exponential backoff
   */
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Max retries exceeded");
  },

  /**
   * Fallback to cached data
   */
  withFallback<T>(primary: T | null | undefined, fallback: T): T {
    return primary ?? fallback;
  },

  /**
   * Safe JSON parse with fallback
   */
  safeJsonParse<T>(json: string, fallback: T): T {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  },

  /**
   * Graceful degradation
   */
  tryOrNull<T>(fn: () => T): T | null {
    try {
      return fn();
    } catch {
      return null;
    }
  },
};
