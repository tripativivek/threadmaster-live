import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Users, User, Cpu, ArrowRight, ArrowDown } from "lucide-react";

const ThreadingModels = () => {
  const [activeModel, setActiveModel] = useState("many-to-one");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Threading <span className="text-primary">Models</span>
          </h1>
          <p className="text-muted-foreground mb-12">
            Understanding how user-level threads map to kernel-level threads is fundamental
            to operating system design.
          </p>

          <Tabs value={activeModel} onValueChange={setActiveModel} className="space-y-8">
            <TabsList className="grid grid-cols-3 w-full bg-card">
              <TabsTrigger value="many-to-one" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Many-to-One
              </TabsTrigger>
              <TabsTrigger value="one-to-one" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                One-to-One
              </TabsTrigger>
              <TabsTrigger value="many-to-many" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Many-to-Many
              </TabsTrigger>
            </TabsList>

            <TabsContent value="many-to-one" className="space-y-8">
              <Card className="p-8 bg-card border-border">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  Many-to-One Model
                </h2>
                <p className="text-muted-foreground mb-8">
                  Multiple user-level threads are mapped to a single kernel thread. Thread
                  management is handled in user space, making it efficient. However, if one
                  thread makes a blocking system call, the entire process blocks.
                </p>

                {/* Visual Diagram */}
                <div className="bg-muted/30 rounded-xl p-8 mb-8">
                  <div className="flex flex-col items-center gap-6">
                    {/* User Threads */}
                    <div className="text-center">
                      <span className="text-xs font-mono text-muted-foreground mb-2 block">USER SPACE</span>
                      <div className="flex gap-4 justify-center">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-mono text-sm glow-primary"
                          >
                            U{i}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrows */}
                    <div className="flex gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <ArrowDown key={i} className="w-5 h-5 text-muted-foreground" />
                      ))}
                    </div>

                    {/* Single Kernel Thread */}
                    <div className="text-center">
                      <span className="text-xs font-mono text-muted-foreground mb-2 block">KERNEL SPACE</span>
                      <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center font-mono text-sm">
                        K1
                      </div>
                    </div>

                    <ArrowDown className="w-5 h-5 text-muted-foreground" />

                    {/* CPU */}
                    <div className="flex items-center gap-2 px-6 py-3 bg-secondary rounded-lg border border-border">
                      <Cpu className="w-5 h-5 text-primary" />
                      <span className="font-mono text-sm">CPU</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-thread-running/10 border border-thread-running/30">
                    <h4 className="font-semibold text-thread-running mb-2">Advantages</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Fast thread switching (no kernel involvement)</li>
                      <li>• Portable across operating systems</li>
                      <li>• Low overhead thread management</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <h4 className="font-semibold text-destructive mb-2">Disadvantages</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• One blocking call blocks all threads</li>
                      <li>• Cannot utilize multiple CPUs</li>
                      <li>• No true parallelism</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="one-to-one" className="space-y-8">
              <Card className="p-8 bg-card border-border">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <User className="w-6 h-6 text-primary" />
                  One-to-One Model
                </h2>
                <p className="text-muted-foreground mb-8">
                  Each user thread maps to exactly one kernel thread. This provides more
                  concurrency and can utilize multiple processors. However, creating a user
                  thread requires creating a corresponding kernel thread.
                </p>

                {/* Visual Diagram */}
                <div className="bg-muted/30 rounded-xl p-8 mb-8">
                  <div className="flex flex-col items-center gap-6">
                    {/* User Threads */}
                    <div className="text-center">
                      <span className="text-xs font-mono text-muted-foreground mb-2 block">USER SPACE</span>
                      <div className="flex gap-6 justify-center">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-mono text-sm glow-primary"
                          >
                            U{i}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* One-to-one mapping arrows */}
                    <div className="flex gap-6">
                      {[1, 2, 3].map((i) => (
                        <ArrowDown key={i} className="w-5 h-5 text-muted-foreground" />
                      ))}
                    </div>

                    {/* Kernel Threads */}
                    <div className="text-center">
                      <span className="text-xs font-mono text-muted-foreground mb-2 block">KERNEL SPACE</span>
                      <div className="flex gap-6 justify-center">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center font-mono text-sm"
                          >
                            K{i}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-6">
                      {[1, 2, 3].map((i) => (
                        <ArrowDown key={i} className="w-5 h-5 text-muted-foreground" />
                      ))}
                    </div>

                    {/* CPUs */}
                    <div className="flex gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border border-border">
                          <Cpu className="w-4 h-4 text-primary" />
                          <span className="font-mono text-xs">CPU{i}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-thread-running/10 border border-thread-running/30">
                    <h4 className="font-semibold text-thread-running mb-2">Advantages</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• True parallelism on multiprocessors</li>
                      <li>• One thread blocking doesn't block others</li>
                      <li>• Better concurrency</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <h4 className="font-semibold text-destructive mb-2">Disadvantages</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Higher overhead for thread creation</li>
                      <li>• Limited by kernel thread capacity</li>
                      <li>• More kernel resources required</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="many-to-many" className="space-y-8">
              <Card className="p-8 bg-card border-border">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  Many-to-Many Model
                </h2>
                <p className="text-muted-foreground mb-8">
                  Many user threads are multiplexed onto a smaller or equal number of kernel
                  threads. This combines the advantages of both previous models, allowing
                  true concurrency without the overhead of creating too many kernel threads.
                </p>

                {/* Visual Diagram */}
                <div className="bg-muted/30 rounded-xl p-8 mb-8">
                  <div className="flex flex-col items-center gap-6">
                    {/* User Threads */}
                    <div className="text-center">
                      <span className="text-xs font-mono text-muted-foreground mb-2 block">USER SPACE</span>
                      <div className="flex gap-4 justify-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-mono text-xs glow-primary"
                          >
                            U{i}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Complex mapping */}
                    <svg className="w-full h-16" viewBox="0 0 300 40">
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
                        </marker>
                      </defs>
                      {/* Lines from user threads to kernel threads */}
                      <line x1="50" y1="0" x2="100" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1" markerEnd="url(#arrowhead)" />
                      <line x1="90" y1="0" x2="100" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1" markerEnd="url(#arrowhead)" />
                      <line x1="130" y1="0" x2="150" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1" markerEnd="url(#arrowhead)" />
                      <line x1="170" y1="0" x2="150" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1" markerEnd="url(#arrowhead)" />
                      <line x1="210" y1="0" x2="200" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1" markerEnd="url(#arrowhead)" />
                      <line x1="250" y1="0" x2="200" y2="40" stroke="hsl(var(--muted-foreground))" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    </svg>

                    {/* Kernel Threads */}
                    <div className="text-center">
                      <span className="text-xs font-mono text-muted-foreground mb-2 block">KERNEL SPACE</span>
                      <div className="flex gap-6 justify-center">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center font-mono text-sm"
                          >
                            K{i}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-6">
                      {[1, 2, 3].map((i) => (
                        <ArrowDown key={i} className="w-5 h-5 text-muted-foreground" />
                      ))}
                    </div>

                    {/* CPUs */}
                    <div className="flex gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg border border-border">
                          <Cpu className="w-4 h-4 text-primary" />
                          <span className="font-mono text-xs">CPU{i}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-thread-running/10 border border-thread-running/30">
                    <h4 className="font-semibold text-thread-running mb-2">Advantages</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Best of both worlds</li>
                      <li>• Flexible thread management</li>
                      <li>• Efficient resource utilization</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <h4 className="font-semibold text-destructive mb-2">Disadvantages</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Complex implementation</li>
                      <li>• Scheduling complexity</li>
                      <li>• Harder to debug</li>
                    </ul>
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

export default ThreadingModels;
