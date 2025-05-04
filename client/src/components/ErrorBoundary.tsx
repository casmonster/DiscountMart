import * as React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined });
    // Optionally trigger a page reload:
    // window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary p-8 border-2 border-red-600 bg-red-100 text-red-800 rounded-lg shadow-sm max-w-xl mx-auto my-10">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong.</h2>
          <details className="whitespace-pre-wrap mb-6">
            {this.state.error?.toString()}
          </details>
          <button
            onClick={this.resetError}
            className="retry-button bg-red-700 hover:bg-red-800 text-white font-medium px-5 py-2 rounded transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
