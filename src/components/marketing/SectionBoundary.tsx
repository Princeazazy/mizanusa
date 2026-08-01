import { Component, type ReactNode } from "react";

/**
 * Section-level isolation for the marketing routes: if one section throws, only
 * that section is dropped (or replaced by `fallback`) — the rest of the page
 * keeps rendering instead of the whole viewport collapsing to the app-level
 * error card.
 */
export class SectionBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; label?: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.warn(`Marketing section "${this.props.label ?? "unknown"}" failed:`, error.message);
  }

  render() {
    if (this.state.failed) return <>{this.props.fallback ?? null}</>;
    return <>{this.props.children}</>;
  }
}

export default SectionBoundary;
