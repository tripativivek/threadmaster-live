import { Card } from "@/components/ui/card";
import { BookOpen, Code, Users, Cpu, ExternalLink } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            About This <span className="text-primary">Project</span>
          </h1>
          <p className="text-muted-foreground mb-12">
            An educational web application for understanding operating system concepts.
          </p>

          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Course Information</h2>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong className="text-foreground">Course:</strong> Operating Systems</p>
                    <p><strong className="text-foreground">Project:</strong> Real-Time Multi-Threaded Application Simulator</p>
                    <p><strong className="text-foreground">Type:</strong> Educational Web Application</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Project Objectives</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Demonstrate multithreading models (Many-to-One, One-to-One, Many-to-Many)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Visualize thread life-cycle states and transitions
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Explain synchronization mechanisms (Semaphores & Monitors)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Simulate CPU scheduling algorithms (Round Robin)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Provide an interactive simulator for hands-on learning
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-thread-running/10 border border-thread-running/20 flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-thread-running" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Technologies Used</h2>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-2">Frontend</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• React 18 with TypeScript</li>
                        <li>• Tailwind CSS for styling</li>
                        <li>• Shadcn/UI components</li>
                        <li>• Lucide React icons</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Real-time visualizations</li>
                        <li>• Interactive simulations</li>
                        <li>• Responsive design</li>
                        <li>• Smooth animations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-thread-waiting/10 border border-thread-waiting/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-thread-waiting" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Key Concepts Covered</h2>
                  <div className="grid gap-3 mt-4">
                    {[
                      { title: "Threading Models", desc: "Understanding how user threads map to kernel threads" },
                      { title: "Thread States", desc: "NEW, READY, RUNNING, WAITING, TERMINATED lifecycle" },
                      { title: "Synchronization", desc: "Preventing race conditions with semaphores and monitors" },
                      { title: "CPU Scheduling", desc: "Fair time sharing using Round Robin algorithm" },
                      { title: "Mutual Exclusion", desc: "Ensuring thread-safe access to shared resources" },
                    ].map((concept) => (
                      <div key={concept.title} className="p-3 rounded-lg bg-muted/20 border border-border/50">
                        <h4 className="font-medium text-sm">{concept.title}</h4>
                        <p className="text-xs text-muted-foreground">{concept.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Ready to Explore?</h2>
                <p className="text-muted-foreground mb-4">
                  Start with the interactive simulator or explore the concepts step by step.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <a
                    href="/simulator"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Launch Simulator
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="/threading-models"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Learn Concepts
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
