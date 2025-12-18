import { ThreadState } from "./ThreadNode";

const states: { state: ThreadState; label: string; description: string }[] = [
  { state: "new", label: "NEW", description: "Thread created, not started" },
  { state: "ready", label: "READY", description: "Waiting for CPU" },
  { state: "running", label: "RUNNING", description: "Currently executing" },
  { state: "waiting", label: "WAITING", description: "Blocked on I/O or resource" },
  { state: "terminated", label: "TERMINATED", description: "Execution complete" },
];

const stateColors: Record<ThreadState, string> = {
  new: "bg-muted border-muted-foreground/50",
  ready: "bg-primary/20 border-primary",
  running: "bg-thread-running/20 border-thread-running",
  waiting: "bg-thread-waiting/20 border-thread-waiting",
  terminated: "bg-destructive/20 border-destructive",
};

export const StateLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center p-4 bg-card rounded-xl border border-border">
      {states.map(({ state, label }) => (
        <div key={state} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full border-2 ${stateColors[state]}`}
          />
          <span className="text-xs font-mono text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
};
