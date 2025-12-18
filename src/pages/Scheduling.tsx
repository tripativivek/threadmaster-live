import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";

interface ScheduleProcess {
  id: number;
  name: string;
  burstTime: number;
  remainingTime: number;
  color: string;
  completed: boolean;
}

interface TimelineBlock {
  processId: number;
  startTime: number;
  endTime: number;
  color: string;
}

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--thread-running))",
  "hsl(var(--thread-waiting))",
  "hsl(var(--destructive))",
];

const Scheduling = () => {
  const [quantum, setQuantum] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentProcess, setCurrentProcess] = useState<number | null>(null);
  const [processes, setProcesses] = useState<ScheduleProcess[]>([
    { id: 1, name: "P1", burstTime: 6, remainingTime: 6, color: colors[0], completed: false },
    { id: 2, name: "P2", burstTime: 4, remainingTime: 4, color: colors[1], completed: false },
    { id: 3, name: "P3", burstTime: 8, remainingTime: 8, color: colors[2], completed: false },
    { id: 4, name: "P4", burstTime: 3, remainingTime: 3, color: colors[3], completed: false },
  ]);
  const [timeline, setTimeline] = useState<TimelineBlock[]>([]);
  const [queue, setQueue] = useState<number[]>([1, 2, 3, 4]);
  const [quantumRemaining, setQuantumRemaining] = useState(quantum);

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentProcess(null);
    setProcesses([
      { id: 1, name: "P1", burstTime: 6, remainingTime: 6, color: colors[0], completed: false },
      { id: 2, name: "P2", burstTime: 4, remainingTime: 4, color: colors[1], completed: false },
      { id: 3, name: "P3", burstTime: 8, remainingTime: 8, color: colors[2], completed: false },
      { id: 4, name: "P4", burstTime: 3, remainingTime: 3, color: colors[3], completed: false },
    ]);
    setTimeline([]);
    setQueue([1, 2, 3, 4]);
    setQuantumRemaining(quantum);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProcesses((prevProcesses) => {
        const updatedProcesses = [...prevProcesses];
        const activeQueue = queue.filter((id) => {
          const p = updatedProcesses.find((proc) => proc.id === id);
          return p && !p.completed;
        });

        if (activeQueue.length === 0) {
          setIsRunning(false);
          return updatedProcesses;
        }

        let nextProcessId = currentProcess;

        // If no current process or quantum expired, get next from queue
        if (!nextProcessId || quantumRemaining <= 0) {
          // Move current process to end of queue if not completed
          if (nextProcessId) {
            const currentProc = updatedProcesses.find((p) => p.id === nextProcessId);
            if (currentProc && !currentProc.completed) {
              setQueue((q) => [...q.filter((id) => id !== nextProcessId), nextProcessId]);
            }
          }

          // Get next process
          nextProcessId = activeQueue[0];
          setQuantumRemaining(quantum);
        }

        if (nextProcessId) {
          const processIndex = updatedProcesses.findIndex((p) => p.id === nextProcessId);
          if (processIndex !== -1) {
            const process = updatedProcesses[processIndex];
            process.remainingTime -= 1;

            // Add to timeline
            setTimeline((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.processId === nextProcessId) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, endTime: currentTime + 1 },
                ];
              }
              return [
                ...prev,
                {
                  processId: nextProcessId,
                  startTime: currentTime,
                  endTime: currentTime + 1,
                  color: process.color,
                },
              ];
            });

            if (process.remainingTime <= 0) {
              process.completed = true;
              setQueue((q) => q.filter((id) => id !== nextProcessId));
              setQuantumRemaining(0);
            } else {
              setQuantumRemaining((q) => q - 1);
            }

            setCurrentProcess(nextProcessId);
          }
        }

        setCurrentTime((t) => t + 1);
        return updatedProcesses;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, currentProcess, quantum, quantumRemaining, queue, currentTime]);

  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const completedProcesses = processes.filter((p) => p.completed).length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            CPU <span className="text-primary">Scheduling</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Visualize the Round Robin scheduling algorithm with configurable time quantum.
            Watch how the CPU time is shared fairly among processes.
          </p>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Controls */}
            <Card className="p-6 bg-card border-border lg:col-span-1">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Controls
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Time Quantum: <span className="text-primary font-mono">{quantum}</span>
                  </label>
                  <Slider
                    value={[quantum]}
                    onValueChange={(v) => setQuantum(v[0])}
                    min={1}
                    max={5}
                    step={1}
                    disabled={isRunning}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex-1 gap-2"
                    disabled={completedProcesses === processes.length}
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? "Pause" : "Start"}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Current Time</span>
                    <span className="font-mono">{currentTime}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-mono">{completedProcesses}/{processes.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono">{Math.round((currentTime / totalBurstTime) * 100)}%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Process Table */}
            <Card className="p-6 bg-card border-border lg:col-span-2">
              <h3 className="font-semibold mb-4">Process Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Process</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Burst Time</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Remaining</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process) => (
                      <tr key={process.id} className="border-b border-border/50">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: process.color }}
                            />
                            <span className="font-mono">{process.name}</span>
                          </div>
                        </td>
                        <td className="py-3 font-mono">{process.burstTime}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-300"
                                style={{
                                  width: `${(process.remainingTime / process.burstTime) * 100}%`,
                                  backgroundColor: process.color,
                                }}
                              />
                            </div>
                            <span className="font-mono text-xs">{process.remainingTime}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-xs font-mono px-2 py-1 rounded ${
                              process.completed
                                ? "bg-thread-running/20 text-thread-running"
                                : currentProcess === process.id
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {process.completed
                              ? "DONE"
                              : currentProcess === process.id
                              ? "RUNNING"
                              : "READY"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold mb-4">Gantt Chart Timeline</h3>
            <div className="overflow-x-auto scrollbar-thin pb-4">
              <div className="min-w-[600px]">
                {/* Timeline bars */}
                <div className="flex h-12 mb-2">
                  {timeline.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                      Start the simulation to see the timeline
                    </div>
                  ) : (
                    timeline.map((block, i) => (
                      <div
                        key={i}
                        className="timeline-bar text-primary-foreground font-bold"
                        style={{
                          backgroundColor: block.color,
                          width: `${((block.endTime - block.startTime) / Math.max(totalBurstTime, 1)) * 100}%`,
                          minWidth: "30px",
                        }}
                      >
                        P{block.processId}
                      </div>
                    ))
                  )}
                </div>

                {/* Time markers */}
                {timeline.length > 0 && (
                  <div className="flex text-xs font-mono text-muted-foreground">
                    <span>0</span>
                    {timeline.map((block, i) => (
                      <span
                        key={i}
                        className="text-right"
                        style={{
                          width: `${((block.endTime - block.startTime) / Math.max(totalBurstTime, 1)) * 100}%`,
                          minWidth: "30px",
                        }}
                      >
                        {block.endTime}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ready Queue */}
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm text-muted-foreground mb-2">Ready Queue</h4>
              <div className="flex gap-2">
                {queue
                  .filter((id) => {
                    const p = processes.find((proc) => proc.id === id);
                    return p && !p.completed;
                  })
                  .map((id, i) => {
                    const process = processes.find((p) => p.id === id);
                    return (
                      <div
                        key={id}
                        className={`px-3 py-1.5 rounded-lg font-mono text-sm border ${
                          i === 0 && isRunning
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-border bg-muted"
                        }`}
                      >
                        {process?.name}
                      </div>
                    );
                  })}
                {queue.filter((id) => {
                  const p = processes.find((proc) => proc.id === id);
                  return p && !p.completed;
                }).length === 0 && (
                  <span className="text-muted-foreground text-sm">Queue empty</span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
