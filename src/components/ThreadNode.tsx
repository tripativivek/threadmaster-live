import { cn } from "@/lib/utils";

export type ThreadState = "new" | "ready" | "running" | "waiting" | "terminated";

interface ThreadNodeProps {
  id: number;
  state: ThreadState;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

const stateColors: Record<ThreadState, string> = {
  new: "thread-new",
  ready: "thread-ready",
  running: "thread-running",
  waiting: "thread-waiting",
  terminated: "thread-terminated",
};

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
};

export const ThreadNode = ({
  id,
  state,
  size = "md",
  showLabel = true,
  animated = true,
}: ThreadNodeProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "thread-node font-mono font-bold",
          stateColors[state],
          sizeClasses[size],
          animated && state === "running" && "pulse-animation"
        )}
      >
        T{id}
        {state === "running" && animated && (
          <span className="absolute inset-0 rounded-full border-2 border-thread-running animate-pulse-ring" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {state}
        </span>
      )}
    </div>
  );
};
