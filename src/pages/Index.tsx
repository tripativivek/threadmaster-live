import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, GitBranch, RefreshCw, Lock, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreadNode, ThreadState } from "@/components/ThreadNode";
import { StateLegend } from "@/components/StateLegend";

const features = [
  {
    icon: GitBranch,
    title: "Threading Models",
    description: "Explore Many-to-One, One-to-Many, and Many-to-Many threading models",
    path: "/threading-models",
  },
  {
    icon: RefreshCw,
    title: "Thread Life Cycle",
    description: "Visualize thread state transitions from creation to termination",
    path: "/lifecycle",
  },
  {
    icon: Lock,
    title: "Synchronization",
    description: "Understand semaphores, monitors, and mutual exclusion",
    path: "/synchronization",
  },
  {
    icon: Clock,
    title: "CPU Scheduling",
    description: "See Round Robin scheduling in action with timeline visualization",
    path: "/scheduling",
  },
  {
    icon: Play,
    title: "Interactive Simulator",
    description: "Create threads, select models, and run real-time simulations",
    path: "/simulator",
  },
];

const Index = () => {
  const [threads, setThreads] = useState<{ id: number; state: ThreadState }[]>([
    { id: 1, state: "running" },
    { id: 2, state: "ready" },
    { id: 3, state: "waiting" },
    { id: 4, state: "ready" },
    { id: 5, state: "new" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreads((prev) =>
        prev.map((thread) => {
          const states: ThreadState[] = ["new", "ready", "running", "waiting", "terminated"];
          const currentIndex = states.indexOf(thread.state);
          if (thread.state === "terminated") {
            return { ...thread, state: "new" };
          }
          const nextIndex = Math.random() > 0.3 ? (currentIndex + 1) % 5 : currentIndex;
          return { ...thread, state: states[nextIndex] };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">Operating Systems Project</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Real-Time{" "}
              <span className="gradient-text">Multi-Threaded</span>
              <br />
              Application Simulator
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              An interactive educational platform to explore and visualize multithreading
              concepts, synchronization mechanisms, and CPU scheduling algorithms.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2 glow-primary">
                <Link to="/simulator">
                  <Play className="w-5 h-5" />
                  Launch Simulator
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/threading-models">
                  Explore Concepts
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Animated Thread Visualization */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8">
              <h3 className="text-center text-sm font-mono text-muted-foreground mb-6 uppercase tracking-wider">
                Live Thread States
              </h3>
              <div className="flex justify-center gap-6 md:gap-10 flex-wrap mb-6">
                {threads.map((thread) => (
                  <ThreadNode
                    key={thread.id}
                    id={thread.id}
                    state={thread.state}
                    size="lg"
                    animated
                  />
                ))}
              </div>
              <StateLegend />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Explore <span className="text-primary">OS Concepts</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Dive into the fundamental concepts of operating system threading with
            interactive visualizations and simulations.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.path}
                  to={feature.path}
                  className="group card-glow bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:glow-primary transition-all">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "3", label: "Threading Models" },
              { value: "5", label: "Thread States" },
              { value: "2", label: "Sync Mechanisms" },
              { value: "∞", label: "Simulations" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
