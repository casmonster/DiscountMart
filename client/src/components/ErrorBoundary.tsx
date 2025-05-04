import * as React from 'react';
import { Component, ErrorInfo, ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public static displayName = 'ErrorBoundary';

  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
            {this.state.error?.toString()}
          </details>
          <button onClick={this.resetError} className="retry-button">
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
