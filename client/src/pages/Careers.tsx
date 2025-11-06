import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Briefcase, MapPin, Clock, Shield, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Careers() {
  const { data: jobs, isLoading } = trpc.jobs.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation - Reusable component would be better, but keeping inline for now */}
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
              <Link href="/careers"><span className="hover:text-secondary transition-colors cursor-pointer font-semibold">Careers</span></Link>
              <Link href="/contact"><Button variant="secondary" size="sm">Contact Us</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
            <p className="text-xl opacity-90">
              Build your career with a veteran-owned company dedicated to advancing radiation oncology care for those who served our nation.
            </p>
          </div>
        </div>
      </section>

      {/* Why Work at PROS */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Work at PROS?</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mission-Driven Work</CardTitle>
                <CardDescription>
                  Serve veterans and military families by delivering world-class radiation oncology care and technology.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Competitive Compensation</CardTitle>
                <CardDescription>
                  Industry-leading salaries, comprehensive benefits, and performance bonuses for top performers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Growth</CardTitle>
                <CardDescription>
                  Continuing education support, certification reimbursement, and opportunities to work with cutting-edge AI technology.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Open Positions</h2>
          
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && jobs && jobs.length === 0 && (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12 text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Open Positions</h3>
                <p className="text-muted-foreground mb-6">
                  We don't have any open positions at the moment, but we're always looking for talented professionals. Please check back soon or submit your resume for future opportunities.
                </p>
                <Link href="/contact">
                  <Button>Contact Us</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {!isLoading && jobs && jobs.length > 0 && (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.department}</Badge>
                          {job.clearanceRequired !== 'none' && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {job.clearanceRequired.replace('-', ' ').toUpperCase()}
                            </Badge>
                          )}
                          {job.salaryRange && (
                            <Badge variant="outline">{job.salaryRange}</Badge>
                          )}
                        </div>
                      </div>
                      <Link href={`/careers/${job.id}`}>
                        <Button>View Details</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">
                      {job.description.substring(0, 250)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About PROS</h3>
              <p className="text-sm opacity-80">
                Veteran-owned staffing company specializing in radiation oncology professionals and AI-powered systems for VA and DoD healthcare facilities.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about"><span className="hover:text-secondary transition-colors cursor-pointer">About Us</span></Link></li>
                <li><Link href="/services"><span className="hover:text-secondary transition-colors cursor-pointer">Services</span></Link></li>
                <li><Link href="/government"><span className="hover:text-secondary transition-colors cursor-pointer">Government Contracting</span></Link></li>
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
