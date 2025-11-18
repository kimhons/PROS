import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calendar, FileText, GraduationCap, Users, ExternalLink, Lock, Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";

// Resource categories and data
const resources = {
  journals: [
    {
      name: "International Journal of Radiation Oncology Biology Physics (Red Journal)",
      description: "Official journal of ASTRO covering clinical and basic research in radiation oncology",
      url: "https://www.redjournal.org/",
      category: "Journals",
      type: "Peer-Reviewed",
      specialty: "Clinical",
    },
    {
      name: "Medical Physics",
      description: "Official journal of AAPM and COMP covering medical physics research",
      url: "https://aapm.onlinelibrary.wiley.com/journal/24734209",
      category: "Journals",
      type: "Peer-Reviewed",
      specialty: "Physics",
    },
    {
      name: "Physics in Medicine & Biology (PMB)",
      description: "Leading journal in medical physics and biomedical engineering",
      url: "https://iopscience.iop.org/journal/0031-9155",
      category: "Journals",
      type: "Peer-Reviewed",
      specialty: "Physics",
    },
    {
      name: "Journal of Applied Clinical Medical Physics (JACMP)",
      description: "Open-access journal for clinical medical physics",
      url: "https://aapm.onlinelibrary.wiley.com/journal/15269914",
      category: "Journals",
      type: "Open Access",
      specialty: "Clinical Physics",
    },
    {
      name: "Radiotherapy and Oncology",
      description: "Official journal of ESTRO covering radiation oncology research",
      url: "https://www.thegreenjournal.com/",
      category: "Journals",
      type: "Peer-Reviewed",
      specialty: "Clinical",
    },
    {
      name: "Practical Radiation Oncology",
      description: "Practical clinical guidance for radiation oncology professionals",
      url: "https://www.practicalradonc.org/",
      category: "Journals",
      type: "Peer-Reviewed",
      specialty: "Clinical Practice",
    },
  ],
  conferences: [
    {
      name: "ASTRO Annual Meeting",
      description: "American Society for Radiation Oncology annual conference",
      url: "https://www.astro.org/meetings-and-education/annual-meeting",
      category: "Conferences",
      type: "Annual",
      specialty: "Clinical",
    },
    {
      name: "AAPM Annual Meeting",
      description: "American Association of Physicists in Medicine annual meeting",
      url: "https://www.aapm.org/meetings/default.asp",
      category: "Conferences",
      type: "Annual",
      specialty: "Physics",
    },
    {
      name: "ESTRO Congress",
      description: "European Society for Radiotherapy & Oncology annual congress",
      url: "https://www.estro.org/Congresses",
      category: "Conferences",
      type: "Annual",
      specialty: "Clinical & Physics",
    },
    {
      name: "RSNA Annual Meeting",
      description: "Radiological Society of North America annual meeting",
      url: "https://www.rsna.org/annual-meeting",
      category: "Conferences",
      type: "Annual",
      specialty: "Imaging",
    },
    {
      name: "COMP Annual Scientific Meeting",
      description: "Canadian Organization of Medical Physicists annual meeting",
      url: "https://www.comp-ocpm.ca/",
      category: "Conferences",
      type: "Annual",
      specialty: "Physics",
    },
  ],
  guidelines: [
    {
      name: "NCCN Clinical Practice Guidelines in Oncology",
      description: "Evidence-based cancer treatment guidelines",
      url: "https://www.nccn.org/professionals/physician_gls/",
      category: "Guidelines",
      type: "Clinical Guidelines",
      specialty: "Clinical",
    },
    {
      name: "ASTRO Clinical Practice Guidelines",
      description: "Evidence-based guidelines for radiation therapy",
      url: "https://www.astro.org/patient-care-and-research/clinical-practice-statements",
      category: "Guidelines",
      type: "Clinical Guidelines",
      specialty: "Clinical",
    },
    {
      name: "AAPM Task Group Reports",
      description: "Comprehensive physics and QA guidelines",
      url: "https://www.aapm.org/pubs/reports/",
      category: "Guidelines",
      type: "Technical Reports",
      specialty: "Physics",
    },
    {
      name: "ICRU Reports",
      description: "International Commission on Radiation Units and Measurements",
      url: "https://www.icru.org/",
      category: "Guidelines",
      type: "Standards",
      specialty: "Dosimetry",
    },
    {
      name: "IAEA Technical Documents",
      description: "International Atomic Energy Agency radiation oncology resources",
      url: "https://www.iaea.org/resources/rpop/health-professionals/radiotherapy",
      category: "Guidelines",
      type: "Technical Documents",
      specialty: "Clinical & Physics",
    },
  ],
  organizations: [
    {
      name: "American Board of Radiology (ABR)",
      description: "Certification and continuing education for radiation oncology professionals",
      url: "https://www.theabr.org/",
      category: "Organizations",
      type: "Certification",
      specialty: "All",
    },
    {
      name: "ASTRO (American Society for Radiation Oncology)",
      description: "Professional society for radiation oncology",
      url: "https://www.astro.org/",
      category: "Organizations",
      type: "Professional Society",
      specialty: "Clinical",
    },
    {
      name: "AAPM (American Association of Physicists in Medicine)",
      description: "Professional society for medical physics",
      url: "https://www.aapm.org/",
      category: "Organizations",
      type: "Professional Society",
      specialty: "Physics",
    },
    {
      name: "ACR (American College of Radiology)",
      description: "Professional organization for radiologists and radiation oncologists",
      url: "https://www.acr.org/",
      category: "Organizations",
      type: "Professional Society",
      specialty: "All",
    },
    {
      name: "CAMPEP",
      description: "Commission on Accreditation of Medical Physics Education Programs",
      url: "https://www.campep.org/",
      category: "Organizations",
      type: "Accreditation",
      specialty: "Education",
    },
    {
      name: "ASRT (American Society of Radiologic Technologists)",
      description: "Professional society for radiation therapists",
      url: "https://www.asrt.org/",
      category: "Organizations",
      type: "Professional Society",
      specialty: "Therapy",
    },
  ],
  education: [
    {
      name: "ASTRO University",
      description: "Online education platform for radiation oncology",
      url: "https://university.astro.org/",
      category: "Education",
      type: "Online Courses",
      specialty: "Clinical",
    },
    {
      name: "AAPM Virtual Library",
      description: "Educational resources and webinars for medical physics",
      url: "https://www.aapm.org/education/vl/",
      category: "Education",
      type: "Webinars & Videos",
      specialty: "Physics",
    },
    {
      name: "ESTRO School",
      description: "Educational courses and training programs",
      url: "https://www.estro.org/School",
      category: "Education",
      type: "Courses & Workshops",
      specialty: "Clinical & Physics",
    },
    {
      name: "RadOnc Questions",
      description: "Board review questions for radiation oncology",
      url: "https://www.radoncquestions.com/",
      category: "Education",
      type: "Board Review",
      specialty: "Clinical",
    },
    {
      name: "ABR MOC (Maintenance of Certification)",
      description: "Continuing certification for radiation oncology professionals",
      url: "https://www.theabr.org/radiation-oncology/moc-requirements",
      category: "Education",
      type: "Continuing Education",
      specialty: "All",
    },
  ],
};

const allResources = [
  ...resources.journals,
  ...resources.conferences,
  ...resources.guidelines,
  ...resources.organizations,
  ...resources.education,
];

export default function ResourceAggregator() {
  const { user, loading, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const filteredResources = allResources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSpecialty = selectedSpecialty === "all" || resource.specialty.includes(selectedSpecialty);
    return matchesSearch && matchesCategory && matchesSpecialty;
  });

  const categories = ["all", "Journals", "Conferences", "Guidelines", "Organizations", "Education"];
  const specialties = ["all", "Clinical", "Physics", "Clinical Physics", "All"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
            </div>
          </div>
        </nav>

        {/* Login Required Section */}
        <section className="py-16 flex-1 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                  <Lock className="h-10 w-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Resource Aggregator</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Curated collection of radiation oncology journals, conferences, guidelines, and professional development resources.
                </p>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign In Required</CardTitle>
                  <CardDescription className="text-base">
                    Create a free account to access our comprehensive resource library.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 text-left">
                      <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Peer-Reviewed Journals</h4>
                        <p className="text-sm text-muted-foreground">Direct links to Red Journal, Medical Physics, PMB, JACMP, and more</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Conferences & Events</h4>
                        <p className="text-sm text-muted-foreground">ASTRO, AAPM, ESTRO, and other major radiation oncology conferences</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Clinical Guidelines</h4>
                        <p className="text-sm text-muted-foreground">NCCN, ASTRO, AAPM TG reports, ICRU, and IAEA resources</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <GraduationCap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Continuing Education</h4>
                        <p className="text-sm text-muted-foreground">Online courses, webinars, board review, and MOC resources</p>
                      </div>
                    </div>
                  </div>

                  <a href={getLoginUrl()}>
                    <Button size="lg" className="w-full text-lg">
                      Sign In to Access Resources
                    </Button>
                  </a>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Free account • No credit card required • Access all professional tools
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated user view
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
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {user?.name}</span>
              <Link href="/tools"><Button variant="secondary" size="sm">All Tools</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Resource Aggregator Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Resource Aggregator</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Curated collection of radiation oncology journals, conferences, guidelines, and professional resources
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8">
              <CardContent className="py-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat === "all" ? "All Categories" : cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec === "all" ? "All Specialties" : spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Showing {filteredResources.length} of {allResources.length} resources</span>
                </div>
              </CardContent>
            </Card>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, idx) => {
                const IconComponent = 
                  resource.category === "Journals" ? BookOpen :
                  resource.category === "Conferences" ? Calendar :
                  resource.category === "Guidelines" ? FileText :
                  resource.category === "Organizations" ? Users :
                  GraduationCap;

                return (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">{resource.type}</Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{resource.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{resource.specialty}</Badge>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="default">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Suggestion Box */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Missing a Resource?</h3>
                <p className="text-muted-foreground mb-6">
                  We're constantly updating our resource library. Let us know if there's a journal, conference, or resource you'd like to see added.
                </p>
                <Link href="/contact">
                  <Button size="lg">
                    Suggest a Resource
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
