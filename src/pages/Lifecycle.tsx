import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { ThreadNode, ThreadState } from "@/components/ThreadNode";

interface StateInfo {
  state: ThreadState;
  description: string;
  transitions: { to: ThreadState; label: string }[];
}

const stateInfos: StateInfo[] = [
  {
    state: "new",
    description: "Thread has been created but not yet started. The start() method has not been invoked.",
    transitions: [{ to: "ready", label: "start()" }],
  },
  {
    state: "ready",
    description: "Thread is ready to run and waiting for CPU time. It's in the ready queue.",
    transitions: [{ to: "running", label: "dispatch" }],
  },
  {
    state: "running",
    description: "Thread is currently executing on the CPU. Only one thread per CPU can be in this state.",
    transitions: [
      { to: "ready", label: "preempt / yield" },
      { to: "waiting", label: "wait() / I/O" },
      { to: "terminated", label: "exit()" },
    ],
  },
  {
    state: "waiting",
    description: "Thread is blocked waiting for an event, I/O operation, or resource to become available.",
    transitions: [{ to: "ready", label: "notify() / I/O complete" }],
  },
  {
    state: "terminated",
    description: "Thread has completed execution or was explicitly terminated. Cannot be restarted.",
    transitions: [],
  },
];

const Lifecycle = () => {
  const [activeState, setActiveState] = useState<ThreadState>("new");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    const sequence: ThreadState[] = ["new", "ready", "running", "waiting", "ready", "running", "terminated"];
    let index = 0;

    const interval = setInterval(() => {
      setActiveState(sequence[index]);
      index++;
      if (index >= sequence.length) {
        setIsAnimating(false);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const activeInfo = stateInfos.find((s) => s.state === activeState);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Thread <span className="text-primary">Life Cycle</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            A thread goes through various states during its lifetime. Click on any state
            to learn more, or watch the animation.
          </p>

          <div className="flex gap-3 mb-8">
            <Button
              onClick={() => setIsAnimating(!isAnimating)}
              variant={isAnimating ? "destructive" : "default"}
              className="gap-2"
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isAnimating ? "Pause" : "Animate"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAnimating(false);
                setActiveState("new");
              }}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* State Diagram */}
          <Card className="p-8 bg-card border-border mb-8">
            <div className="relative">
              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: "400px" }}>
                <defs>
                  <marker
                    id="arrowhead-lifecycle"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
                  </marker>
                </defs>

                {/* NEW -> READY */}
                <path
                  d="M 100 80 L 100 150"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead-lifecycle)"
                  className={activeState === "new" ? "animate-pulse" : "opacity-30"}
                />

                {/* READY -> RUNNING */}
                <path
                  d="M 150 200 L 350 200"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead-lifecycle)"
                  className={activeState === "ready" ? "animate-pulse" : "opacity-30"}
                />

                {/* RUNNING -> READY (preempt) */}
                <path
                  d="M 350 170 L 150 170"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                  markerEnd="url(#arrowhead-lifecycle)"
                  className={activeState === "running" ? "animate-pulse" : "opacity-30"}
                />

                {/* RUNNING -> WAITING */}
                <path
                  d="M 450 200 L 550 200"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead-lifecycle)"
                  className={activeState === "running" ? "animate-pulse" : "opacity-30"}
                />

                {/* WAITING -> READY */}
                <path
                  d="M 600 150 Q 350 50 100 150"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead-lifecycle)"
                  className={activeState === "waiting" ? "animate-pulse" : "opacity-30"}
                />

                {/* RUNNING -> TERMINATED */}
                <path
                  d="M 400 250 L 400 320"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead-lifecycle)"
                  className={activeState === "running" ? "animate-pulse" : "opacity-30"}
                />
              </svg>

              {/* State Nodes */}
              <div className="relative" style={{ minHeight: "400px" }}>
                {/* NEW */}
                <div
                  className="absolute cursor-pointer transition-transform hover:scale-110"
                  style={{ left: "50px", top: "20px" }}
                  onClick={() => setActiveState("new")}
                >
                  <ThreadNode id={0} state="new" size="lg" showLabel animated={activeState === "new"} />
                </div>

                {/* READY */}
                <div
                  className="absolute cursor-pointer transition-transform hover:scale-110"
                  style={{ left: "50px", top: "160px" }}
                  onClick={() => setActiveState("ready")}
                >
                  <ThreadNode id={0} state="ready" size="lg" showLabel animated={activeState === "ready"} />
                </div>

                {/* RUNNING */}
                <div
                  className="absolute cursor-pointer transition-transform hover:scale-110"
                  style={{ left: "350px", top: "160px" }}
                  onClick={() => setActiveState("running")}
                >
                  <ThreadNode id={0} state="running" size="lg" showLabel animated={activeState === "running"} />
                </div>

                {/* WAITING */}
                <div
                  className="absolute cursor-pointer transition-transform hover:scale-110"
                  style={{ left: "550px", top: "160px" }}
                  onClick={() => setActiveState("waiting")}
                >
                  <ThreadNode id={0} state="waiting" size="lg" showLabel animated={activeState === "waiting"} />
                </div>

                {/* TERMINATED */}
                <div
                  className="absolute cursor-pointer transition-transform hover:scale-110"
                  style={{ left: "350px", top: "320px" }}
                  onClick={() => setActiveState("terminated")}
                >
                  <ThreadNode id={0} state="terminated" size="lg" showLabel animated={activeState === "terminated"} />
                </div>

                {/* Transition Labels */}
                <span className="absolute text-xs font-mono text-primary" style={{ left: "110px", top: "100px" }}>
                  start()
                </span>
                <span className="absolute text-xs font-mono text-primary" style={{ left: "220px", top: "210px" }}>
                  dispatch
                </span>
                <span className="absolute text-xs font-mono text-muted-foreground" style={{ left: "220px", top: "155px" }}>
                  preempt
                </span>
                <span className="absolute text-xs font-mono text-primary" style={{ left: "480px", top: "210px" }}>
                  wait()
                </span>
                <span className="absolute text-xs font-mono text-primary" style={{ left: "350px", top: "50px" }}>
                  notify()
                </span>
                <span className="absolute text-xs font-mono text-destructive" style={{ left: "410px", top: "280px" }}>
                  exit()
                </span>
              </div>
            </div>
          </Card>

          {/* State Details */}
          {activeInfo && (
            <Card className="p-6 bg-card border-border animate-scale-in">
              <div className="flex items-start gap-4">
                <ThreadNode id={0} state={activeInfo.state} size="md" showLabel={false} animated />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold capitalize mb-2">{activeInfo.state} State</h3>
                  <p className="text-muted-foreground mb-4">{activeInfo.description}</p>
                  {activeInfo.transitions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Transitions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeInfo.transitions.map((t) => (
                          <Button
                            key={t.to}
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveState(t.to)}
                            className="font-mono text-xs"
                          >
                            {t.label} → {t.to.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lifecycle;
