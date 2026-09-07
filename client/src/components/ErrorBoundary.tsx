import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for monitoring
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    // Store error for potential reporting
    try {
      const errors = JSON.parse(sessionStorage.getItem("app_errors") || "[]");
      errors.push(errorData);
      // Keep only last 10 errors
      if (errors.length > 10) errors.shift();
      sessionStorage.setItem("app_errors", JSON.stringify(errors));
    } catch (e) {
      // Silently fail if storage is unavailable
    }

    // Increment error count
    this.setState((prevState) => ({
      errorCount: prevState.errorCount + 1,
    }));
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // If too many errors, show critical error page
      if (this.state.errorCount > 3) {
        return (
          <div className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
            <div className="flex w-full max-w-2xl flex-col items-center rounded-lg border border-destructive/30 bg-card p-8">
              <AlertTriangle size={56} className="mb-6 shrink-0 text-destructive" />

              <h2 className="mb-2 text-2xl font-bold text-destructive">Critical Error</h2>
              <p className="mb-6 text-center text-muted-foreground">
                The application has encountered multiple critical errors and needs to be restarted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={this.handleReload}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold",
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  )}
                >
                  <RotateCcw size={18} />
                  Restart Application
                </button>
                <button
                  onClick={this.handleHome}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold",
                    "bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  )}
                >
                  <Home size={18} />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
          <div className="flex w-full max-w-2xl flex-col items-center rounded-lg border border-primary/30 bg-card p-8">
            <AlertTriangle size={48} className="mb-6 shrink-0 text-primary" />

            <h2 className="mb-2 text-2xl font-bold text-primary">Something Went Wrong</h2>
            <p className="mb-6 text-center text-muted-foreground">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV === "development" && (
              <details className="mb-6 w-full rounded border border-border bg-muted/50 p-4">
                <summary className="cursor-pointer font-semibold text-primary hover:opacity-80">
                  Error Details
                </summary>
                <pre className="mt-3 max-h-48 overflow-auto break-words whitespace-pre-wrap text-xs text-muted-foreground">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 w-full">
              <button
                onClick={this.handleReset}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold",
                  "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                )}
              >
                <RotateCcw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleHome}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold",
                  "bg-muted text-foreground hover:bg-muted/80 transition-colors"
                )}
              >
                <Home size={18} />
                Go Home
              </button>
            </div>

            {/* Error count indicator */}
            {this.state.errorCount > 1 && (
              <p className="mt-4 text-xs text-muted-foreground">
                Error count: {this.state.errorCount}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
