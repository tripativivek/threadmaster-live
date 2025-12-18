import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Plus, Trash2, Cpu, GitBranch } from "lucide-react";
import { ThreadNode, ThreadState } from "@/components/ThreadNode";
import { StateLegend } from "@/components/StateLegend";

interface SimThread {
  id: number;
  state: ThreadState;
  progress: number;
  createdAt: number;
}

type ThreadingModel = "many-to-one" | "one-to-one" | "many-to-many";

const Simulator = () => {
  const [threads, setThreads] = useState<SimThread[]>([]);
  const [model, setModel] = useState<ThreadingModel>("many-to-one");
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [nextId, setNextId] = useState(1);
  const [kernelThreads, setKernelThreads] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = useCallback((message: string) => {
    setLogs((prev) => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  const addThread = useCallback(() => {
    const newThread: SimThread = {
      id: nextId,
      state: "new",
      progress: 0,
      createdAt: Date.now(),
    };
    setThreads((prev) => [...prev, newThread]);
    setNextId((id) => id + 1);
    addLog(`Thread ${nextId} created`);
  }, [nextId, addLog]);

  const removeThread = useCallback((id: number) => {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    addLog(`Thread ${id} removed`);
  }, [addLog]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setThreads([]);
    setNextId(1);
    setLogs([]);
  }, []);

  // Update kernel threads based on model
  useEffect(() => {
    if (model === "many-to-one") {
      setKernelThreads(1);
    } else if (model === "one-to-one") {
      setKernelThreads(threads.length);
    } else {
      setKernelThreads(Math.min(Math.ceil(threads.length / 2), 4));
    }
  }, [model, threads.length]);

  // Simulation loop
  useEffect(() => {
    if (!isRunning || threads.length === 0) return;

    const interval = setInterval(() => {
      setThreads((prev) => {
        const updated = [...prev];
        
        // Count running threads based on model
        const maxRunning = model === "many-to-one" ? 1 : kernelThreads;
        const runningThreads = updated.filter((t) => t.state === "running");
        const readyThreads = updated.filter((t) => t.state === "ready");
        const newThreads = updated.filter((t) => t.state === "new");

        // Transition new threads to ready
        newThreads.forEach((thread) => {
          const idx = updated.findIndex((t) => t.id === thread.id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], state: "ready" };
            addLog(`Thread ${thread.id}: NEW → READY`);
          }
        });

        // Process running threads
        runningThreads.forEach((thread) => {
          const idx = updated.findIndex((t) => t.id === thread.id);
          if (idx !== -1) {
            const newProgress = thread.progress + (10 * speed);
            
            if (newProgress >= 100) {
              updated[idx] = { ...updated[idx], state: "terminated", progress: 100 };
              addLog(`Thread ${thread.id}: RUNNING → TERMINATED`);
            } else if (Math.random() > 0.9) {
              updated[idx] = { ...updated[idx], state: "waiting", progress: newProgress };
              addLog(`Thread ${thread.id}: RUNNING → WAITING (I/O)`);
            } else if (Math.random() > 0.85) {
              updated[idx] = { ...updated[idx], state: "ready", progress: newProgress };
              addLog(`Thread ${thread.id}: RUNNING → READY (preempted)`);
            } else {
              updated[idx] = { ...updated[idx], progress: newProgress };
            }
          }
        });

        // Wake up waiting threads randomly
        updated.forEach((thread, idx) => {
          if (thread.state === "waiting" && Math.random() > 0.7) {
            updated[idx] = { ...updated[idx], state: "ready" };
            addLog(`Thread ${thread.id}: WAITING → READY (I/O complete)`);
          }
        });

        // Dispatch ready threads if slots available
        const currentRunning = updated.filter((t) => t.state === "running").length;
        const availableSlots = maxRunning - currentRunning;
        
        if (availableSlots > 0) {
          const toDispatch = updated
            .filter((t) => t.state === "ready")
            .slice(0, availableSlots);
          
          toDispatch.forEach((thread) => {
            const idx = updated.findIndex((t) => t.id === thread.id);
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], state: "running" };
              addLog(`Thread ${thread.id}: READY → RUNNING`);
            }
          });
        }

        return updated;
      });
    }, 500 / speed);

    return () => clearInterval(interval);
  }, [isRunning, threads.length, model, kernelThreads, speed, addLog]);

  const activeThreads = threads.filter((t) => t.state !== "terminated");
  const completedThreads = threads.filter((t) => t.state === "terminated");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Thread <span className="text-primary">Simulator</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Create threads, select a threading model, and watch the simulation in real-time.
          </p>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Controls Panel */}
            <Card className="p-6 bg-card border-border lg:col-span-1">
              <h3 className="font-semibold mb-4">Controls</h3>

              <div className="space-y-6">
                {/* Threading Model */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Threading Model</label>
                  <Select value={model} onValueChange={(v) => setModel(v as ThreadingModel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="many-to-one">Many-to-One</SelectItem>
                      <SelectItem value="one-to-one">One-to-One</SelectItem>
                      <SelectItem value="many-to-many">Many-to-Many</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Speed Control */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Speed: <span className="text-primary font-mono">{speed}x</span>
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={(v) => setSpeed(v[0])}
                    min={0.5}
                    max={3}
                    step={0.5}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button onClick={addThread} className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Create Thread
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      variant={isRunning ? "destructive" : "default"}
                      className="flex-1 gap-2"
                      disabled={threads.length === 0}
                    >
                      {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isRunning ? "Pause" : "Start"}
                    </Button>
                    <Button variant="outline" onClick={reset} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">User Threads</span>
                    <span className="font-mono">{threads.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kernel Threads</span>
                    <span className="font-mono">{kernelThreads}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active</span>
                    <span className="font-mono text-thread-running">{activeThreads.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-mono text-primary">{completedThreads.length}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Visualization Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Thread Model Diagram */}
              <Card className="p-6 bg-card border-border">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{model.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("-to-")} Model</h3>
                </div>

                <div className="flex flex-col items-center gap-6">
                  {/* User Threads */}
                  <div className="text-center w-full">
                    <span className="text-xs font-mono text-muted-foreground mb-3 block">USER THREADS</span>
                    <div className="flex flex-wrap justify-center gap-4">
                      {threads.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No threads created. Click "Create Thread" to start.</p>
                      ) : (
                        threads.map((thread) => (
                          <div key={thread.id} className="relative group">
                            <ThreadNode
                              id={thread.id}
                              state={thread.state}
                              size="md"
                              animated={thread.state === "running"}
                            />
                            {thread.state !== "running" && (
                              <button
                                onClick={() => removeThread(thread.id)}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3 h-3 text-destructive-foreground" />
                              </button>
                            )}
                            {/* Progress bar */}
                            {thread.state === "running" && (
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-thread-running transition-all"
                                  style={{ width: `${thread.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Connection Lines */}
                  {threads.length > 0 && (
                    <div className="text-muted-foreground">
                      <svg width="100" height="40">
                        <path d="M50 0 L50 40" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                      </svg>
                    </div>
                  )}

                  {/* Kernel Threads */}
                  {threads.length > 0 && (
                    <div className="text-center">
                      <span className="text-xs font-mono text-muted-foreground mb-3 block">KERNEL THREADS</span>
                      <div className="flex justify-center gap-4">
                        {Array.from({ length: kernelThreads }).map((_, i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center font-mono text-sm"
                          >
                            K{i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CPU */}
                  {threads.length > 0 && (
                    <>
                      <div className="text-muted-foreground">
                        <svg width="100" height="40">
                          <path d="M50 0 L50 40" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2 px-6 py-3 bg-secondary rounded-lg border border-border">
                        <Cpu className="w-6 h-6 text-primary" />
                        <span className="font-mono font-semibold">CPU</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <StateLegend />
                </div>
              </Card>

              {/* Event Log */}
              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold mb-4">Event Log</h3>
                <div className="font-mono text-sm space-y-1 h-48 overflow-y-auto scrollbar-thin bg-muted/30 rounded-lg p-4">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground">Start the simulation to see events...</p>
                  ) : (
                    logs.map((log, i) => (
                      <p key={i} className="text-foreground">{log}</p>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
