import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, Lock, Unlock, AlertTriangle } from "lucide-react";

interface Process {
  id: number;
  state: "waiting" | "critical" | "done";
  progress: number;
}

const Synchronization = () => {
  const [activeTab, setActiveTab] = useState("semaphore");
  const [isRunning, setIsRunning] = useState(false);
  const [semaphoreValue, setSemaphoreValue] = useState(1);
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, state: "waiting", progress: 0 },
    { id: 2, state: "waiting", progress: 0 },
    { id: 3, state: "waiting", progress: 0 },
  ]);
  const [raceCondition, setRaceCondition] = useState(false);
  const [sharedCounter, setSharedCounter] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSemaphoreValue(1);
    setProcesses([
      { id: 1, state: "waiting", progress: 0 },
      { id: 2, state: "waiting", progress: 0 },
      { id: 3, state: "waiting", progress: 0 },
    ]);
    setSharedCounter(0);
    setRaceCondition(false);
    setLogs([]);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setProcesses((prev) => {
        const updated = [...prev];
        const waitingProcesses = updated.filter((p) => p.state === "waiting");
        const criticalProcess = updated.find((p) => p.state === "critical");

        if (criticalProcess) {
          // Progress the critical section
          criticalProcess.progress += 20;
          if (criticalProcess.progress >= 100) {
            criticalProcess.state = "done";
            criticalProcess.progress = 100;
            setSemaphoreValue((v) => v + 1);
            addLog(`P${criticalProcess.id} exits critical section (signal)`);
            setSharedCounter((c) => c + 1);
          }
        } else if (waitingProcesses.length > 0 && semaphoreValue > 0) {
          // Let one process enter
          const nextProcess = waitingProcesses[0];
          nextProcess.state = "critical";
          setSemaphoreValue((v) => v - 1);
          addLog(`P${nextProcess.id} enters critical section (wait)`);
        }

        // Check if all done
        if (updated.every((p) => p.state === "done")) {
          setIsRunning(false);
          addLog("All processes completed successfully!");
        }

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, semaphoreValue]);

  // Race condition simulation
  const simulateRaceCondition = () => {
    setRaceCondition(true);
    setSharedCounter(0);
    let counter = 0;
    const expected = 3;

    // Simulate unsynchronized access
    setTimeout(() => {
      const read1 = counter;
      setTimeout(() => {
        const read2 = counter;
        setTimeout(() => {
          counter = read1 + 1;
          setTimeout(() => {
            counter = read2 + 1;
            setSharedCounter(counter);
            addLog(`Race condition! Expected: ${expected}, Got: ${counter}`);
          }, 100);
        }, 100);
      }, 50);
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Thread <span className="text-primary">Synchronization</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Explore how semaphores and monitors prevent race conditions and ensure
            mutual exclusion in concurrent systems.
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-3 w-full bg-card">
              <TabsTrigger value="semaphore" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Semaphore
              </TabsTrigger>
              <TabsTrigger value="monitor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Monitor
              </TabsTrigger>
              <TabsTrigger value="race" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Race Condition
              </TabsTrigger>
            </TabsList>

            <TabsContent value="semaphore" className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-primary" />
                  Binary Semaphore Simulation
                </h2>
                <p className="text-muted-foreground mb-6">
                  A semaphore is a synchronization primitive that controls access to a shared
                  resource. Watch how processes wait() and signal() to enter the critical section.
                </p>

                <div className="flex gap-3 mb-6">
                  <Button onClick={() => setIsRunning(!isRunning)} className="gap-2">
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? "Pause" : "Start"}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>

                {/* Semaphore Value */}
                <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-muted-foreground">Semaphore Value</span>
                    <div className="flex items-center gap-2">
                      {semaphoreValue > 0 ? (
                        <Unlock className="w-5 h-5 text-thread-running" />
                      ) : (
                        <Lock className="w-5 h-5 text-destructive" />
                      )}
                      <span className="text-2xl font-bold font-mono">{semaphoreValue}</span>
                    </div>
                  </div>
                </div>

                {/* Processes */}
                <div className="space-y-4 mb-6">
                  {processes.map((process) => (
                    <div key={process.id} className="p-4 bg-muted/20 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-medium">Process {process.id}</span>
                        <span
                          className={`text-xs font-mono px-2 py-1 rounded ${
                            process.state === "waiting"
                              ? "bg-thread-waiting/20 text-thread-waiting"
                              : process.state === "critical"
                              ? "bg-thread-running/20 text-thread-running"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {process.state.toUpperCase()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            process.state === "critical" ? "bg-thread-running" : "bg-muted-foreground"
                          }`}
                          style={{ width: `${process.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shared Counter */}
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Shared Counter</span>
                    <span className="text-3xl font-bold font-mono text-primary">{sharedCounter}</span>
                  </div>
                </div>
              </Card>

              {/* Logs */}
              <Card className="p-4 bg-card border-border">
                <h3 className="font-mono text-sm text-muted-foreground mb-2">Event Log</h3>
                <div className="font-mono text-sm space-y-1 h-40 overflow-y-auto scrollbar-thin">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground">Start the simulation to see events...</p>
                  ) : (
                    logs.map((log, i) => (
                      <p key={i} className="text-foreground">{log}</p>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="monitor" className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-semibold mb-4">Monitor Concept</h2>
                <p className="text-muted-foreground mb-6">
                  A monitor is a higher-level synchronization construct that encapsulates shared
                  data and operations on that data, with implicit mutual exclusion.
                </p>

                <div className="bg-muted/30 rounded-xl p-6 border border-border">
                  <div className="code-block mb-6">
                    <pre className="text-sm">
{`monitor SharedResource {
  private int count = 0;
  private condition notEmpty;
  
  public synchronized void increment() {
    count++;
    notEmpty.signal();
  }
  
  public synchronized int getCount() {
    while (count == 0) {
      notEmpty.wait();
    }
    return count;
  }
}`}
                    </pre>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                      <h4 className="font-semibold text-primary mb-2">Key Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Implicit mutual exclusion</li>
                        <li>• Condition variables for waiting</li>
                        <li>• Encapsulated shared state</li>
                        <li>• Cleaner than semaphores</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                      <h4 className="font-semibold text-accent mb-2">Operations</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <code className="text-primary">wait()</code> - block until signaled</li>
                        <li>• <code className="text-primary">signal()</code> - wake one waiting thread</li>
                        <li>• <code className="text-primary">broadcast()</code> - wake all waiting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="race" className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-thread-waiting" />
                  Race Condition Demo
                </h2>
                <p className="text-muted-foreground mb-6">
                  A race condition occurs when multiple threads access shared data without
                  proper synchronization, leading to unpredictable results.
                </p>

                <div className="mb-6">
                  <Button
                    onClick={simulateRaceCondition}
                    variant="destructive"
                    className="gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Trigger Race Condition
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-muted/30 rounded-xl border border-border">
                    <h3 className="font-semibold mb-4">Without Synchronization</h3>
                    <div className="code-block text-xs mb-4">
                      <pre>
{`// Thread 1 & 2 both do:
temp = counter;     // read
temp = temp + 1;    // increment  
counter = temp;     // write

// Result: counter = 1 (wrong!)
// Expected: counter = 2`}
                      </pre>
                    </div>
                    {raceCondition && (
                      <div className="p-3 bg-destructive/20 rounded-lg border border-destructive/40">
                        <p className="text-sm text-destructive font-mono">
                          ⚠️ Race detected! Counter: {sharedCounter} (should be 3)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-thread-running/10 rounded-xl border border-thread-running/30">
                    <h3 className="font-semibold mb-4 text-thread-running">With Synchronization</h3>
                    <div className="code-block text-xs mb-4">
                      <pre>
{`// Thread 1 & 2 use semaphore:
wait(mutex);        // acquire lock
temp = counter;     
temp = temp + 1;    
counter = temp;     
signal(mutex);      // release lock

// Result: counter = 2 (correct!)`}
                      </pre>
                    </div>
                    <div className="p-3 bg-thread-running/20 rounded-lg border border-thread-running/40">
                      <p className="text-sm text-thread-running font-mono">
                        ✓ Mutual exclusion ensures correctness
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Synchronization;
