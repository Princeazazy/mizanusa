import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  /** Short description of the surface, used in the fallback copy. */
  label?: string;
}

interface State {
  error: Error | null;
}

/** Friendly boundary so one bad render never blanks the whole workspace. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Render error:", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        role="alert"
        className="surface-panel mx-auto my-10 flex max-w-lg flex-col items-start gap-4 p-8"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-expense/10 text-expense">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[17px] font-medium text-foreground">
            {this.props.label ?? "This section"} couldn’t be displayed
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
            Something went wrong while rendering. Your data is unaffected — try again, and if it
            keeps happening reload the page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={this.reset} size="sm" className="gap-2">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </Button>
          <Button onClick={() => window.location.reload()} size="sm" variant="outline">
            Reload page
          </Button>
        </div>
      </div>
    );
  }
}
