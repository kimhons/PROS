import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO } from "@/const";
import { Building2, Brain, Shield, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src={APP_LOGO} alt="PROS Logo" className="h-12 w-auto" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">PROS</span>
                  <span className="text-xs opacity-90">Precision Radiation Oncology Solutions</span>
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about">
                <span className="hover:text-secondary transition-colors cursor-pointer">About</span>
              </Link>
              <Link href="/services">
                <span className="hover:text-secondary transition-colors cursor-pointer">Services</span>
              </Link>
              <Link href="/government">
                <span className="hover:text-secondary transition-colors cursor-pointer">Government Contracting</span>
              </Link>
              <Link href="/newsletter">
                <span className="hover:text-secondary transition-colors cursor-pointer">Newsletter</span>
              </Link>
              <Link href="/tools">
                <span className="hover:text-secondary transition-colors cursor-pointer">Tools</span>
              </Link>
              <Link href="/blog">
                <span className="hover:text-secondary transition-colors cursor-pointer">Blog</span>
              </Link>
              <Link href="/careers">
                <span className="hover:text-secondary transition-colors cursor-pointer">Careers</span>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="sm">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold">Veteran-Owned Small Business</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Elite Radiation Oncology Staffing & AI Solutions
            </h1>
            <p className="text-lg opacity-80 mb-2 font-semibold tracking-wide">
              Elite Talent. Intelligent Systems. Exceptional Care.
            </p>
            <p className="text-xl opacity-90 mb-8">
              Empowering VA, DoD, and civilian healthcare facilities with specialized professionals and transformative AI-driven technologies for precision cancer care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Our Services
                </Button>
              </Link>
              <Link href="/careers">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  View Open Positions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose PROS?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine specialized medical staffing with cutting-edge AI technology to deliver unparalleled value to government healthcare facilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Elite Staffing</CardTitle>
                <CardDescription>
                  Top-tier medical physicists, dosimetrists, radiation therapists, and oncology nurses with government clearance experience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Powered Systems</CardTitle>
                <CardDescription>
                  Proprietary AI solutions for treatment planning optimization, workflow automation, and quality assurance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Veteran-Owned</CardTitle>
                <CardDescription>
                  VOSB certified with deep understanding of government and civilian healthcare systems. Serving VA, DoD, academic medical centers, and community hospitals nationwide.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Government Ready</CardTitle>
                <CardDescription>
                  CMMC Level 2 compliant, NIST AI RMF aligned, and experienced with VA Schedule 621 I and DoD contracting.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Medical Staffing Solutions</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive staffing for radiation oncology departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Medical Physicists (Diagnostic & Therapeutic)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Dosimetrists & Treatment Planners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Radiation Therapists (RTT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Oncology Nurses & Clinical Coordinators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Locum Tenens & Permanent Placement</span>
                  </li>
                </ul>
                <Link href="/services#staffing">
                  <Button className="mt-6 w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">AI & Technology Solutions</CardTitle>
                <CardDescription className="text-base">
                  Intelligent systems for modern radiation oncology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Treatment Planning Optimization (AI/ML)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Workflow Automation & Integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Quality Assurance & Safety Systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Varian Ecosystem Integration (Aria, Eclipse, Velocity)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>FISMA & NIST AI RMF Compliant</span>
                  </li>
                </ul>
                <Link href="/services#technology">
                  <Button className="mt-6 w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Stay Informed with Our Newsletter</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Biweekly insights on radiation oncology: latest news, best practices, cutting-edge research, and clinical recommendations from industry experts.
            </p>
            <Card className="border-2">
              <CardContent className="pt-6">
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <Button size="lg" type="submit" className="px-8">
                    Subscribe
                  </Button>
                </form>
                <p className="text-sm text-muted-foreground mt-4">
                  Join 5,000+ radiation oncology professionals receiving expert insights every two weeks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Partner with PROS?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you're a VA facility, DoD hospital, academic medical center, or community hospital seeking elite staffing and technology solutions—or a healthcare professional looking for your next opportunity—we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Contact Us
              </Button>
            </Link>
            <Link href="/careers">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Explore Careers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
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
