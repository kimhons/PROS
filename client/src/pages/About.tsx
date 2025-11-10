import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Eye, Heart, Award } from "lucide-react";
import { Link } from "wouter";

export default function About() {
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
              <Link href="/about"><span className="hover:text-secondary transition-colors cursor-pointer font-semibold">About</span></Link>
              <Link href="/services"><span className="hover:text-secondary transition-colors cursor-pointer">Services</span></Link>
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
            <h1 className="text-5xl font-bold mb-4">About PROS</h1>
            <p className="text-xl opacity-90">
              A veteran-owned company dedicated to advancing cancer care through precision-guided radiation therapy.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center">Who We Are</h2>
            <div className="prose prose-lg max-w-none text-foreground">
              <p className="text-lg leading-relaxed mb-6">
                Precision Radiation Oncology Solutions is a specialized healthcare consultancy and technology firm dedicated to advancing cancer treatment through precision-guided radiation therapy. We partner with oncology centers, hospitals, and research institutions to deliver comprehensive solutions that combine clinical expertise with cutting-edge technology.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Founded by veterans who understand the unique challenges of military and VA healthcare systems, PROS brings deep domain expertise in radiation oncology, advanced technology implementation, and government contracting. Our team includes board-certified medical physicists, experienced dosimetrists, certified radiation therapists, and AI engineers who are passionate about improving cancer care for those who served our nation.
              </p>
              <p className="text-lg leading-relaxed">
                We believe that every patient deserves access to the most advanced, precise, and compassionate cancer care available. By combining elite medical staffing with intelligent AI systems, we empower oncology teams to deliver safer, smarter, and more personalized treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Mission */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-lg leading-relaxed">
                  To empower oncology teams with the tools, talent, and technology to deliver safer, smarter, and more compassionate cancer care.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground text-lg leading-relaxed">
                  To be the most trusted partner for the Department of Veterans Affairs and Department of Defense in advancing radiation oncology, setting the national standard for excellence.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Precision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  We are relentless in our pursuit of accuracy, quality, and excellence in everything we do, from the professionals we place to the technologies we develop.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Service</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  Inspired by our veteran roots, we are deeply committed to serving those who have served our country, ensuring they receive the best care possible.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Integrity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  We operate with unwavering honesty, transparency, and ethical principles, building trust with our government partners, our employees, and the patients they serve.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Innovation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  We are driven to pioneer the next generation of radiation oncology solutions, continuously exploring and implementing advanced technologies to solve clinical challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Collaboration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  We believe in the power of partnership, working closely with VA and DoD stakeholders to understand their unique needs and deliver tailored, effective solutions.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Why Veteran-Owned Matters */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Why Veteran-Owned Matters</h2>
            <p className="text-xl leading-relaxed opacity-90 mb-8">
              As a veteran-owned business, we bring firsthand understanding of military culture, VA healthcare systems, and the unique challenges facing veterans and their families. We know what it means to serve, and we're honored to continue that service by ensuring our nation's heroes receive world-class cancer care.
            </p>
            <p className="text-xl leading-relaxed opacity-90 mb-8">
              Our veteran-owned status isn't just a certification—it's a commitment. It means we understand the importance of mission, the value of discipline, and the necessity of getting things right the first time. When you partner with PROS, you're working with a team that shares your values and your dedication to excellence.
            </p>
            <Link href="/government">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Learn About Our Certifications
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Partner with PROS?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how we can support your radiation oncology program with elite staffing and intelligent technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8">
                Contact Us
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Explore Our Services
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
