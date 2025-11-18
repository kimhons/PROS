import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Shield, 
  DollarSign, 
  FileText, 
  Upload, 
  CheckCircle2,
  ArrowLeft,
  Briefcase,
  Calendar
} from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function JobDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const jobId = parseInt(params.id || "0");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    coverLetter: "",
    yearsExperience: "",
    currentClearance: "",
    certifications: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { data: job, isLoading, error } = trpc.jobs.getById.useQuery({ id: jobId });

  const submitApplication = trpc.applications.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to submit application: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      
      submitApplication.mutate({
        jobId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        resumeFile: {
          name: resumeFile.name,
          data: base64,
          type: resumeFile.type,
        },
        coverLetter: formData.coverLetter || undefined,
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
        currentClearance: formData.currentClearance || undefined,
        certifications: formData.certifications || undefined,
      });
    };
    reader.readAsDataURL(resumeFile);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <nav className="bg-primary text-primary-foreground shadow-md">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/logo.png" alt="PROS Logo" className="h-12 w-auto" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">PROS</span>
                  <span className="text-xs opacity-90">Precision Radiation Oncology Solutions</span>
                </div>
              </div>
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-6">The position you're looking for doesn't exist or has been closed.</p>
            <Link href="/careers">
              <Button>View All Open Positions</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <nav className="bg-primary text-primary-foreground shadow-md">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img src="/logo.png" alt="PROS Logo" className="h-12 w-auto" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">PROS</span>
                  <span className="text-xs opacity-90">Precision Radiation Oncology Solutions</span>
                </div>
              </div>
            </Link>
          </div>
        </nav>
        <section className="py-16 flex-1 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Application Submitted!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Thank you for applying to <strong>{job.title}</strong> at PROS. We've received your application and will review it carefully. If your qualifications match our needs, we'll contact you within 5-7 business days.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/careers">
                  <Button variant="default" size="lg">
                    View More Positions
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Return Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const employmentTypeLabels = {
    "full-time": "Full-Time",
    "part-time": "Part-Time",
    "contract": "Contract",
    "locum-tenens": "Locum Tenens",
  };

  const clearanceLabels = {
    "none": "None Required",
    "public-trust": "Public Trust",
    "secret": "Secret",
    "top-secret": "Top Secret",
  };

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
              <Link href="/contact">
                <Button variant="secondary" size="sm">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Job Detail Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link href="/careers">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Positions
              </Button>
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Job Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-lg">{job.department}</CardDescription>
                      </div>
                      <Badge variant="default" className="text-sm px-3 py-1">
                        {employmentTypeLabels[job.employmentType]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>Clearance: {clearanceLabels[job.clearanceRequired]}</span>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{job.salaryRange}</span>
                        </div>
                      )}
                      {job.closingDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Closes: {new Date(job.closingDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Position Description
                      </h3>
                      <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                        {job.description}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Requirements
                      </h3>
                      <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                        {job.requirements}
                      </div>
                    </div>

                    {job.benefits && (
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Benefits</h3>
                        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                          {job.benefits}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Application Form */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Apply for this Position</CardTitle>
                    <CardDescription>
                      Submit your application and we'll be in touch soon
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="resume">Resume * (PDF or Word, max 5MB)</Label>
                        <div className="mt-2">
                          <label htmlFor="resume" className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                            <Upload className="h-5 w-5 text-muted-foreground mr-2" />
                            <span className="text-sm text-muted-foreground">
                              {resumeFile ? resumeFile.name : "Click to upload resume"}
                            </span>
                          </label>
                          <input
                            id="resume"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="yearsExperience">Years of Experience</Label>
                        <Input
                          id="yearsExperience"
                          type="number"
                          placeholder="5"
                          value={formData.yearsExperience}
                          onChange={(e) => handleChange('yearsExperience', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="currentClearance">Current Clearance Level</Label>
                        <Input
                          id="currentClearance"
                          placeholder="e.g., Secret, Top Secret"
                          value={formData.currentClearance}
                          onChange={(e) => handleChange('currentClearance', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="certifications">Certifications</Label>
                        <Input
                          id="certifications"
                          placeholder="e.g., ABR, DABR, RTT"
                          value={formData.certifications}
                          onChange={(e) => handleChange('certifications', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Tell us why you're interested in this position..."
                          value={formData.coverLetter}
                          onChange={(e) => handleChange('coverLetter', e.target.value)}
                          rows={4}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={submitApplication.isPending}
                      >
                        {submitApplication.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By submitting, you agree to our terms and privacy policy
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
