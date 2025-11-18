import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Zap, BookOpen, CheckSquare, Link as LinkIcon, Lock } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Tools() {
  const { isAuthenticated } = useAuth();

  const tools = [
    {
      title: "Staffing Calculator",
      description: "Calculate optimal FTE requirements for your radiation oncology department based on ASTRO and AAPM guidelines (TG-268).",
      icon: Calculator,
      href: "/tools/staffing-calculator",
      status: "available",
      features: [
        "ASTRO/AAPM guideline-based calculations",
        "Modality-specific adjustments (IMRT, SBRT, SRS, Proton)",
        "Detailed FTE breakdown by role",
        "Complexity factor analysis",
      ],
    },
    {
      title: "BED Calculator",
      description: "Comprehensive Biologically Effective Dose calculator with tissue-specific presets and fractionation schemes.",
      icon: Zap,
      href: "/tools/bed-calculator",
      status: "coming-soon",
      features: [
        "α/β ratio presets for common tissues",
        "Multiple fractionation schemes",
        "EQD2 calculations",
        "Hypofractionation analysis",
      ],
    },
    {
      title: "Protocol Library",
      description: "Searchable database of radiation oncology treatment protocols organized by disease site, stage, and modality.",
      icon: BookOpen,
      href: "/tools/protocol-library",
      status: "coming-soon",
      features: [
        "Protocols by disease site and stage",
        "Evidence-based guidelines",
        "PDF downloads",
        "Regular updates from literature",
      ],
    },
    {
      title: "QA Checklist Generator",
      description: "Generate customized quality assurance checklists based on AAPM TG reports, ASTRO guidelines, and MPPG recommendations.",
      icon: CheckSquare,
      href: "/tools/qa-checklist",
      status: "coming-soon",
      features: [
        "Machine QA checklists",
        "Patient-specific QA workflows",
        "Annual QA templates",
        "Compliance tracking",
      ],
    },
    {
      title: "Resource Aggregator",
      description: "Curated collection of radiation oncology resources including journals, conferences, webinars, and professional development.",
      icon: LinkIcon,
      href: "/tools/resources",
      status: "coming-soon",
      features: [
        "Peer-reviewed journals",
        "Upcoming conferences and webinars",
        "Professional guidelines",
        "Continuing education opportunities",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/logo.png" alt="PROS Logo" className="h-12 w-auto" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">PROS</span>
                  <span className="text-xs opacity-90">Precision Radiation Oncology Solutions</span>
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about"><span className="hover:text-secondary transition-colors cursor-pointer">About</span></Link>
              <Link href="/services"><span className="hover:text-secondary transition-colors cursor-pointer">Services</span></Link>
              <Link href="/government"><span className="hover:text-secondary transition-colors cursor-pointer">Government Contracting</span></Link>
              <Link href="/newsletter"><span className="hover:text-secondary transition-colors cursor-pointer">Newsletter</span></Link>
              <Link href="/tools"><span className="hover:text-secondary transition-colors cursor-pointer font-semibold">Tools</span></Link>
              <Link href="/careers"><span className="hover:text-secondary transition-colors cursor-pointer">Careers</span></Link>
              <Link href="/contact"><Button variant="secondary" size="sm">Contact Us</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Professional Tools for Radiation Oncology</h1>
            <p className="text-xl opacity-90 mb-8">
              Free, evidence-based calculators and resources designed for medical physicists, dosimetrists, therapists, and oncology professionals.
            </p>
            {!isAuthenticated && (
              <div className="flex items-center justify-center gap-2 bg-secondary/20 text-secondary-foreground px-6 py-3 rounded-lg inline-flex">
                <Lock className="h-5 w-5" />
                <span className="font-semibold">Sign in to access all tools</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              const isAvailable = tool.status === "available";
              
              return (
                <Card key={index} className={`hover:shadow-lg transition-shadow ${!isAvailable ? 'opacity-75' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      {!isAvailable && (
                        <Badge variant="secondary">Coming Soon</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-sm">Key Features:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {tool.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {isAvailable ? (
                      <Link href={tool.href}>
                        <Button variant="default" className="w-full">
                          {isAuthenticated ? "Open Tool" : "Sign In to Access"}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Want to See a Specific Tool?</h3>
                <p className="text-muted-foreground mb-6">
                  We're constantly developing new resources for radiation oncology professionals. 
                  Let us know what tools would be most valuable to you.
                </p>
                <Link href="/contact">
                  <Button size="lg">
                    Request a Tool
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About PROS</h3>
              <p className="text-sm opacity-80">
                Veteran-owned staffing company specializing in radiation oncology professionals and AI-powered systems for VA, DoD, and civilian healthcare facilities nationwide.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about"><span className="hover:text-secondary transition-colors cursor-pointer">About Us</span></Link></li>
                <li><Link href="/services"><span className="hover:text-secondary transition-colors cursor-pointer">Services</span></Link></li>
                <li><Link href="/government"><span className="hover:text-secondary transition-colors cursor-pointer">Government Contracting</span></Link></li>
                <li><Link href="/newsletter"><span className="hover:text-secondary transition-colors cursor-pointer">Newsletter</span></Link></li>
                <li><Link href="/tools"><span className="hover:text-secondary transition-colors cursor-pointer">Tools</span></Link></li>
                <li><Link href="/careers"><span className="hover:text-secondary transition-colors cursor-pointer">Careers</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Certifications</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>• Veteran-Owned Small Business (VOSB)</li>
                <li>• VA Schedule 621 I</li>
                <li>• CMMC Level 2 Compliant</li>
                <li>• NIST AI RMF Aligned</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Email: info@pros-staffing.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>SAM.gov UEI: [Pending]</li>
                <li>CAGE Code: [Pending]</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2025 Precision Radiation Oncology Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
