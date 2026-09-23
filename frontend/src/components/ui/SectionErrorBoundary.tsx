import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { 
  AlertTriangleIcon, 
  RotateCcwIcon, 
  HomeIcon, 
  CompassIcon, 
  CopyIcon, 
  CheckIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  TerminalIcon
} from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import type { ViewId } from '../../data/appData';

interface Props {
  sectionName: string;
  onNavigate?: (id: ViewId) => void;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  showTechnicalDetails: boolean;
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showTechnicalDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[SectionErrorBoundary: ${this.props.sectionName}] Uncaught error:`, error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showTechnicalDetails: false,
    });
  };

  handleCopyDetails = () => {
    const { error, errorInfo } = this.state;
    const text = `Section: ${this.props.sectionName}\nError: ${error?.name}: ${error?.message}\nStack:\n${error?.stack || ''}\nComponent Stack:\n${errorInfo?.componentStack || ''}`;
    navigator.clipboard.writeText(text).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    });
  };

  render() {
    if (this.state.hasError) {
      const { sectionName, onNavigate } = this.props;
      const { error, errorInfo, copied, showTechnicalDetails } = this.state;

      return (
        <div className="mx-auto max-w-2xl py-8 px-4 animate-in fade-in duration-300">
          <Card className="border-red-500/30 bg-white dark:border-red-500/20 dark:bg-zinc-900 shadow-xl overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-600/10 via-amber-500/10 to-red-600/10 border-b border-red-500/20 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                  <AlertTriangleIcon className="h-6 w-6" />
                </div>
                <div>
                  <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-800 dark:bg-red-950/80 dark:text-red-300">
                    Section Runtime Isolation
                  </span>
                  <h2 className="mt-1 font-display text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {sectionName} Encountered a Problem
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                A rendering exception occurred inside the <strong>{sectionName}</strong> view. The error has been isolated so the rest of your session and learning progress remain protected.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Primary Error Summary Card */}
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                <div className="flex items-start gap-2">
                  <TerminalIcon className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-red-900 dark:text-red-200">
                      {error?.name || 'Error'}: {error?.message || 'Unknown runtime error occurred.'}
                    </p>
                    <p className="mt-1 text-[11px] text-red-700/80 dark:text-red-300/70">
                      You can retry loading this section or navigate to another part of the curriculum journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  onClick={this.handleRetry}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-sm text-xs h-9"
                >
                  <RotateCcwIcon className="h-3.5 w-3.5" />
                  Reload Section
                </Button>

                {onNavigate && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => onNavigate('path')}
                      className="flex items-center gap-2 text-xs h-9"
                    >
                      <CompassIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      Curriculum Path
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => onNavigate('dashboard')}
                      className="flex items-center gap-2 text-xs h-9"
                    >
                      <HomeIcon className="h-3.5 w-3.5" />
                      Dashboard
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  onClick={this.handleCopyDetails}
                  className="flex items-center gap-1.5 text-xs h-9 ml-auto text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      <span>Copy Details</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Collapsible Technical Details */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => this.setState({ showTechnicalDetails: !showTechnicalDetails })}
                  className="flex items-center justify-between w-full text-left text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  <span>Technical Diagnostics & Stack Trace</span>
                  {showTechnicalDetails ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>

                {showTechnicalDetails && (
                  <div className="mt-3 space-y-2 animate-in fade-in">
                    <pre className="max-h-56 overflow-auto rounded-xl bg-zinc-950 p-4 font-mono text-[11px] text-red-400 leading-relaxed border border-zinc-800">
                      {error?.stack || error?.message || 'No stack trace available.'}
                      {errorInfo?.componentStack && `\n\nComponent Hierarchy:${errorInfo.componentStack}`}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
