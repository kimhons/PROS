import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2, Users, Cpu, Handshake } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    inquiryType: "general" as "staffing" | "technology" | "partnership" | "general",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const submitContact = trpc.contacts.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thank you for contacting us! We'll respond within 24 hours.");
    },
    onError: (error) => {
      toast.error(`Failed to submit: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitContact.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inquiryTypes = [
    {
      value: "staffing",
      label: "Staffing Request",
      icon: Users,
      description: "Request medical physicists, dosimetrists, therapists, or other radiation oncology professionals",
    },
    {
      value: "technology",
      label: "Technology Consultation",
      icon: Cpu,
      description: "Inquire about AI-powered systems, workflow optimization, or treatment planning solutions",
    },
    {
      value: "partnership",
      label: "Partnership Opportunity",
      icon: Handshake,
      description: "Explore collaboration opportunities or vendor partnerships",
    },
    {
      value: "general",
      label: "General Inquiry",
      icon: Mail,
      description: "General questions or other inquiries",
    },
  ];

  if (submitted) {
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
                <Link href="/tools"><span className="hover:text-secondary transition-colors cursor-pointer">Tools</span></Link>
                <Link href="/careers"><span className="hover:text-secondary transition-colors cursor-pointer">Careers</span></Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Success Message */}
        <section className="py-16 flex-1 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Message Sent Successfully!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Thank you for contacting Precision Radiation Oncology Solutions. We've received your inquiry and will respond within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/">
                  <Button variant="default" size="lg">
                    Return Home
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
              <Link href="/tools"><span className="hover:text-secondary transition-colors cursor-pointer">Tools</span></Link>
              <Link href="/careers"><span className="hover:text-secondary transition-colors cursor-pointer">Careers</span></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">
              Let's discuss how PROS can support your radiation oncology staffing and technology needs
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>
                      Reach out to discuss your needs or ask questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <a href="mailto:info@pros-staffing.com" className="text-sm text-muted-foreground hover:text-primary">
                          info@pros-staffing.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Phone</h4>
                        <a href="tel:+15551234567" className="text-sm text-muted-foreground hover:text-primary">
                          (555) 123-4567
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Office</h4>
                        <p className="text-sm text-muted-foreground">
                          Nationwide Service<br />
                          Serving VA, DoD, and Civilian Facilities
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">SAM.gov</h4>
                        <p className="text-sm text-muted-foreground">
                          UEI: [Pending]<br />
                          CAGE Code: [Pending]
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-6">
                    <h4 className="font-semibold mb-2">Response Time</h4>
                    <p className="text-sm text-muted-foreground">
                      We typically respond to all inquiries within 24 hours during business days.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Inquiry Type Selection */}
                      <div className="space-y-3">
                        <Label>What can we help you with? *</Label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {inquiryTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <Card
                                key={type.value}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  formData.inquiryType === type.value ? 'border-primary border-2 bg-primary/5' : ''
                                }`}
                                onClick={() => handleChange('inquiryType', type.value)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                      <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm mb-1">{type.label}</h4>
                                      <p className="text-xs text-muted-foreground">{type.description}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="organization">Organization</Label>
                          <Input
                            id="organization"
                            placeholder="Your hospital or facility"
                            value={formData.organization}
                            onChange={(e) => handleChange('organization', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          placeholder="Brief description of your inquiry"
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          required
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Please provide details about your inquiry, including any specific requirements, timelines, or questions..."
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          rows={6}
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex items-center gap-4">
                        <Button
                          type="submit"
                          size="lg"
                          disabled={submitContact.isPending}
                          className="flex-1"
                        >
                          {submitContact.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        * Required fields. By submitting this form, you agree to be contacted by PROS regarding your inquiry.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
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
