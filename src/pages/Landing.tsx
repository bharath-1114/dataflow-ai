import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  Upload,
  BarChart3,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Check,
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Drag and drop your CSV files for instant processing",
  },
  {
    icon: BarChart3,
    title: "Smart Charts",
    description: "AI-powered visualization recommendations",
  },
  {
    icon: Sparkles,
    title: "Custom Analysis",
    description: "Build personalized dashboards with drag & drop",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Ask questions about your data in natural language",
  },
];

const benefits = [
  "Automatic data type detection",
  "Interactive visualizations",
  "Export to multiple formats",
  "Real-time collaboration",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="container relative py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <Logo className="scale-150" />
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Transform Your Data Into
              <span className="gradient-text"> Actionable Insights</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              AI-powered data visualization that turns complex datasets into
              beautiful, interactive dashboards. No coding required.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="hero-outline" size="xl">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 bg-muted/30 py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Everything You Need for Data Analysis
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed for professionals and researchers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="stat-card group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                Built for Enterprise-Grade Analytics
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Whether you're a researcher, analyst, or business professional,
                our platform provides the tools you need to make data-driven
                decisions.
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20">
                      <Check className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl border border-border bg-card p-6 shadow-soft">
                {/* Mock dashboard preview */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-destructive/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-lg bg-muted animate-pulse" />
                  <div className="h-24 rounded-lg bg-muted animate-pulse" />
                  <div className="col-span-2 h-32 rounded-lg bg-muted animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-muted/30 py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Visualize Your Data?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of professionals using DataViz AI
          </p>
          <Link to="/signup">
            <Button variant="gradient" size="xl" className="gap-2">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo iconOnly />
          <p className="text-sm text-muted-foreground">
            © 2024 DataViz AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
