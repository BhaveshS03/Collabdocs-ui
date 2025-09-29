import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Users, Zap, Shield, Cloud, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">CollabDocs</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="organic-bg py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            The Future of
            <span className="text-primary block">Document Editing</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Create, collaborate, and share documents with powerful tools designed for modern teams. 
            Experience seamless editing with real-time collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto shadow-glow">
                Start Creating <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Everything you need to create amazing documents
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features that make document creation and collaboration effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="doc-card border-border/50 shadow-soft">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Experience blazing-fast performance with our optimized editor that handles large documents with ease.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="doc-card border-border/50 shadow-soft">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Collaboration</CardTitle>
                <CardDescription>
                  Work together in real-time with your team. See changes instantly and collaborate seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="doc-card border-border/50 shadow-soft">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your documents are protected with enterprise-grade security and privacy controls.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="doc-card border-border/50 shadow-soft">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Cloud Sync</CardTitle>
                <CardDescription>
                  Access your documents anywhere, anytime. Automatic cloud sync keeps everything up to date.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="doc-card border-border/50 shadow-soft">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rich Formatting</CardTitle>
                <CardDescription>
                  Create beautiful documents with advanced formatting options and professional templates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="doc-card border-border/50 shadow-soft">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Organization</CardTitle>
                <CardDescription>
                  Organize your documents with folders, tags, and powerful search capabilities.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-4xl font-bold text-foreground mb-6">
            Ready to transform your workflow?
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already using CollabDocs to create amazing documents together.
          </p>
          <Link to="/register">
            <Button size="lg" className="shadow-glow">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 CollabDocs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;