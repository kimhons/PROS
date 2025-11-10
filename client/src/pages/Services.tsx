import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, Cpu, Brain, Shield, Users, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
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
              <Link href="/services"><span className="hover:text-secondary transition-colors cursor-pointer font-semibold">Services</span></Link>
              <Link href="/government"><span className="hover:text-secondary transition-colors cursor-pointer">Government Contracting</span></Link>
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
            <h1 className="text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl opacity-90">
              Comprehensive solutions that combine clinical expertise, advanced technology, and elite staffing to transform radiation oncology care.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Clinical Workflow Optimization */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Workflow className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">Clinical Workflow Optimization</CardTitle>
                    <CardDescription className="text-base">
                      Streamlining treatment planning, imaging integration, and multidisciplinary coordination
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  We analyze your current radiation oncology workflows to identify bottlenecks, inefficiencies, and opportunities for improvement. Our consultants work alongside your clinical teams to implement streamlined processes that reduce treatment delays, improve communication between departments, and enhance patient outcomes.
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Treatment planning process optimization and standardization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Imaging modality integration (CT, MRI, PET fusion)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Multidisciplinary tumor board coordination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Quality assurance workflow enhancement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Technology Implementation & Training */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Cpu className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">Technology Implementation & Training</CardTitle>
                    <CardDescription className="text-base">
                      Supporting deployment of advanced radiation platforms, including IMRT, SBRT, and proton therapy
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  Implementing new radiation therapy technology requires more than equipment installation—it demands comprehensive training, workflow integration, and ongoing support. Our team has extensive experience deploying advanced treatment modalities and ensuring your staff can leverage them effectively.
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>IMRT, VMAT, and SBRT program development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Proton therapy implementation and commissioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Varian ecosystem integration (Aria, Eclipse, Velocity)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Comprehensive staff training and competency assessment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* AI-Enhanced Treatment Planning */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">AI-Enhanced Treatment Planning</CardTitle>
                    <CardDescription className="text-base">
                      Leveraging artificial intelligence to improve accuracy, reduce planning time, and personalize care
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  Our proprietary AI solutions complement clinical expertise by automating routine tasks, optimizing dose distributions, and identifying potential issues before treatment begins. All systems are developed in alignment with NIST AI Risk Management Framework to ensure trustworthiness and safety.
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Automated organ-at-risk segmentation and contouring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Intelligent treatment plan optimization algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Predictive analytics for treatment outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Real-time quality assurance and error detection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Regulatory & Compliance Consulting */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">Regulatory & Compliance Consulting</CardTitle>
                    <CardDescription className="text-base">
                      Ensuring adherence to safety standards, accreditation protocols, and ethical guidelines
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">
                  Navigating the complex regulatory landscape of government healthcare requires specialized expertise. We help VA and DoD facilities maintain compliance with federal cybersecurity requirements, AI governance frameworks, and clinical accreditation standards.
                </p>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>CMMC Level 2 cybersecurity compliance preparation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>NIST AI Risk Management Framework implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>ACR accreditation support and documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>HIPAA and FISMA compliance auditing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Staffing & Operational Support */}
            <Card className="border-2 hover:border-primary transition-colors lg:col-span-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">Staffing & Operational Support</CardTitle>
                    <CardDescription className="text-base">
                      Providing highly trained radiation therapists, dosimetrists, physicists, and oncology administrators
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-foreground mb-4">
                      Our staffing services go beyond traditional placement. We recruit, credential, and support elite radiation oncology professionals who understand the unique demands of government healthcare and are committed to serving veterans and military families.
                    </p>
                    <h4 className="font-semibold text-foreground mb-3">Available Positions:</h4>
                    <ul className="space-y-2 text-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Medical Physicists (ABR-certified, Diagnostic & Therapeutic)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Dosimetrists (CMD-certified) and Treatment Planners</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Radiation Therapists (ARRT-certified)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Oncology Nurses and Clinical Coordinators</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Engagement Models:</h4>
                    <ul className="space-y-2 text-foreground mb-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Locum Tenens:</strong> Short-term coverage for vacations, leaves, or temporary vacancies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Contract Staffing:</strong> Long-term assignments (6-24 months) for ongoing support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Permanent Placement:</strong> Full-time recruitment and hiring support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Program Management:</strong> Complete operational oversight of radiation oncology departments</span>
                      </li>
                    </ul>
                    <Link href="/careers">
                      <Button className="w-full">View Open Positions</Button>
                    </Link>
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
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Radiation Oncology Program?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Let's discuss how PROS can help your facility deliver safer, smarter, and more compassionate cancer care.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Schedule a Consultation
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
