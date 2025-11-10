import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileCheck, Award, Building2, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Government() {
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
              <Link href="/government"><span className="hover:text-secondary transition-colors cursor-pointer font-semibold">Government Contracting</span></Link>
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
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold">Veteran-Owned Small Business</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Government Contracting</h1>
            <p className="text-xl opacity-90">
              Certified, compliant, and committed to delivering excellence for VA and DoD healthcare facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications & Compliance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Certifications & Compliance</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">Veteran-Owned Small Business (VOSB)</CardTitle>
                    <Badge className="mt-2" variant="secondary">SBA Certified</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  PROS is certified by the Small Business Administration (SBA) as a Veteran-Owned Small Business through the VetCert program. This certification provides preferential access to VA contracts under the "Vets First" contracting program.
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Eligible for sole-source and set-aside VA contracts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Priority consideration for federal opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Deep understanding of military healthcare culture</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">VA Schedule 621 I</CardTitle>
                    <Badge className="mt-2" variant="secondary">In Progress</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  We are actively pursuing a prime contract on the VA Federal Supply Schedule 621 I for Professional & Allied Healthcare Staffing Services. This schedule provides streamlined procurement for VA facilities nationwide.
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Pre-negotiated pricing for faster procurement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Covers medical physicists and radiation therapy staff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Nationwide coverage for all VA medical centers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">CMMC Level 2 Compliant</CardTitle>
                    <Badge className="mt-2" variant="secondary">Preparing for Certification</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  PROS is preparing for Cybersecurity Maturity Model Certification (CMMC) Level 2, which is required for DoD contracts involving Controlled Unclassified Information (CUI). Our systems and processes align with NIST SP 800-171 requirements.
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>110 security controls implemented</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Protected handling of patient data and CUI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Ready for DoD contract requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">NIST AI RMF Aligned</CardTitle>
                    <Badge className="mt-2" variant="secondary">Voluntary Framework</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  Our AI development processes align with the NIST AI Risk Management Framework, ensuring our intelligent systems are trustworthy, transparent, and safe for deployment in government healthcare settings.
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Fairness and bias mitigation in AI models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Explainability and transparency in decision-making</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Continuous monitoring and validation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* NAICS Codes */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">NAICS Codes & Capabilities</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Primary NAICS Codes</CardTitle>
                <CardDescription>Our registered capabilities for federal contracting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="text-base px-3 py-1">561320</Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Temporary Help Services</h4>
                      <p className="text-sm text-muted-foreground">Primary code for medical and professional staffing services, including radiation oncology professionals.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="text-base px-3 py-1">541511</Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Custom Computer Programming Services</h4>
                      <p className="text-sm text-muted-foreground">Development of proprietary AI software and intelligent systems for radiation oncology.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="text-base px-3 py-1">621399</Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Offices of All Other Miscellaneous Health Practitioners</h4>
                      <p className="text-sm text-muted-foreground">Specialized health services including medical physics consulting and radiation therapy services.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                    <Badge variant="outline" className="text-base px-3 py-1">541715</Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">R&D in Physical, Engineering, and Life Sciences</h4>
                      <p className="text-sm text-muted-foreground">Research and development activities related to AI systems and radiation oncology technology.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SAM.gov Registration */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">SAM.gov Registration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Company Information</h4>
                    <ul className="space-y-2 text-foreground">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Legal Name:</span>
                        <span className="font-medium">Precision Radiation Oncology Solutions</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">UEI:</span>
                        <span className="font-medium">[In Registration]</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">CAGE Code:</span>
                        <span className="font-medium">[Pending Assignment]</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Contracting Vehicles</h4>
                    <ul className="space-y-2 text-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>VA Schedule 621 I (In Progress)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>MQS2-NG Small Business Track (Monitoring)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Open to subcontracting opportunities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Partner on Your Next Contract?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you're a prime contractor seeking a qualified subcontractor or a government agency looking for direct support, we're ready to discuss how PROS can support your mission.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Request Capability Statement
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
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
