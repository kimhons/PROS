import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Lock, Search, Heart, Download, Filter } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ProtocolLibrary() {
  const { user, loading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDiseaseSite, setFilterDiseaseSite] = useState("all");
  const [filterModality, setFilterModality] = useState("all");
  const [filterIntent, setFilterIntent] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { data: protocols, isLoading: protocolsLoading } = trpc.protocols.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: favorites } = trpc.protocols.getFavorites.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const utils = trpc.useUtils();
  const addFavoriteMutation = trpc.protocols.addFavorite.useMutation({
    onSuccess: () => {
      utils.protocols.getFavorites.invalidate();
      toast.success("Added to favorites");
    },
  });

  const removeFavoriteMutation = trpc.protocols.removeFavorite.useMutation({
    onSuccess: () => {
      utils.protocols.getFavorites.invalidate();
      toast.success("Removed from favorites");
    },
  });

  const favoriteIds = useMemo(() => {
    return new Set(favorites?.map(f => f.id) || []);
  }, [favorites]);

  const filteredProtocols = useMemo(() => {
    if (!protocols) return [];

    let filtered = protocols;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.diseasesite.toLowerCase().includes(query) ||
        p.modality.toLowerCase().includes(query) ||
        (p.stage && p.stage.toLowerCase().includes(query))
      );
    }

    // Disease site filter
    if (filterDiseaseSite !== "all") {
      filtered = filtered.filter(p => p.diseasesite === filterDiseaseSite);
    }

    // Modality filter
    if (filterModality !== "all") {
      filtered = filtered.filter(p => p.modality === filterModality);
    }

    // Intent filter
    if (filterIntent !== "all") {
      filtered = filtered.filter(p => p.intent === filterIntent);
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(p => favoriteIds.has(p.id));
    }

    return filtered;
  }, [protocols, searchQuery, filterDiseaseSite, filterModality, filterIntent, showFavoritesOnly, favoriteIds]);

  const diseaseSites = useMemo(() => {
    if (!protocols) return [];
    return Array.from(new Set(protocols.map(p => p.diseasesite))).sort();
  }, [protocols]);

  const modalities = useMemo(() => {
    if (!protocols) return [];
    return Array.from(new Set(protocols.map(p => p.modality))).sort();
  }, [protocols]);

  const exportProtocolToPDF = (protocol: any) => {
    const pdfContent = `
PRECISION RADIATION ONCOLOGY SOLUTIONS
Treatment Protocol
${'='.repeat(60)}

${protocol.title}

${'='.repeat(60)}
PROTOCOL DETAILS
${'='.repeat(60)}

Disease Site: ${protocol.diseasesite}
${protocol.stage ? `Stage: ${protocol.stage}` : ''}
Modality: ${protocol.modality}
Intent: ${protocol.intent.charAt(0).toUpperCase() + protocol.intent.slice(1)}

${'='.repeat(60)}
PRESCRIPTION
${'='.repeat(60)}

Total Dose: ${protocol.totalDose}
Number of Fractions: ${protocol.fractions}
Dose per Fraction: ${protocol.dosePerFraction}

${protocol.targetVolume ? `
${'='.repeat(60)}
TARGET VOLUMES
${'='.repeat(60)}

${protocol.targetVolume}
` : ''}

${protocol.oarConstraints ? `
${'='.repeat(60)}
OAR DOSE CONSTRAINTS
${'='.repeat(60)}

${protocol.oarConstraints}
` : ''}

${protocol.technique ? `
${'='.repeat(60)}
TREATMENT TECHNIQUE
${'='.repeat(60)}

${protocol.technique}
` : ''}

${protocol.clinicalNotes ? `
${'='.repeat(60)}
CLINICAL NOTES
${'='.repeat(60)}

${protocol.clinicalNotes}
` : ''}

${protocol.references ? `
${'='.repeat(60)}
REFERENCES
${'='.repeat(60)}

${protocol.references}
` : ''}

${'='.repeat(60)}

This protocol was accessed from the PROS Protocol Library.
For more information, visit: https://pros-staffing.com

© ${new Date().getFullYear()} Precision Radiation Oncology Solutions
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Protocol_${protocol.diseasesite}_${protocol.modality}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading || protocolsLoading) {
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
                <h1 className="text-4xl font-bold mb-4">Protocol Library</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Comprehensive searchable database of evidence-based radiation oncology treatment protocols.
                </p>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign In Required</CardTitle>
                  <CardDescription className="text-base">
                    Create a free account to access our curated library of treatment protocols.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 text-left">
                      <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Evidence-Based Protocols</h4>
                        <p className="text-sm text-muted-foreground">Curated treatment protocols based on NCCN guidelines, ASTRO recommendations, and landmark trials</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <Search className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Advanced Search & Filters</h4>
                        <p className="text-sm text-muted-foreground">Search by disease site, stage, modality, and treatment intent</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <Download className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Export & Save Favorites</h4>
                        <p className="text-sm text-muted-foreground">Download protocols as PDFs and save frequently used protocols</p>
                      </div>
                    </div>
                  </div>

                  <a href={getLoginUrl()}>
                    <Button size="lg" className="w-full text-lg">
                      Sign In to Access Library
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

      {/* Protocol Library Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Protocol Library</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Evidence-based radiation oncology treatment protocols
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search protocols by title, disease site, or modality..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Select value={filterDiseaseSite} onValueChange={setFilterDiseaseSite}>
                      <SelectTrigger>
                        <SelectValue placeholder="Disease Site" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Disease Sites</SelectItem>
                        {diseaseSites.map(site => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={filterModality} onValueChange={setFilterModality}>
                      <SelectTrigger>
                        <SelectValue placeholder="Modality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modalities</SelectItem>
                        {modalities.map(mod => (
                          <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={filterIntent} onValueChange={setFilterIntent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Intent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Intents</SelectItem>
                        <SelectItem value="definitive">Definitive</SelectItem>
                        <SelectItem value="adjuvant">Adjuvant</SelectItem>
                        <SelectItem value="neoadjuvant">Neoadjuvant</SelectItem>
                        <SelectItem value="palliative">Palliative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="w-full"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                    Favorites Only
                  </Button>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Showing {filteredProtocols.length} of {protocols?.length || 0} protocols</span>
                  {(searchQuery || filterDiseaseSite !== "all" || filterModality !== "all" || filterIntent !== "all" || showFavoritesOnly) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterDiseaseSite("all");
                        setFilterModality("all");
                        setFilterIntent("all");
                        setShowFavoritesOnly(false);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Protocol Cards */}
            {filteredProtocols.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No protocols found</h3>
                  <p className="text-muted-foreground">
                    {showFavoritesOnly 
                      ? "You haven't added any protocols to your favorites yet."
                      : "Try adjusting your search or filters."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredProtocols.map((protocol) => {
                  const isFavorited = favoriteIds.has(protocol.id);
                  
                  return (
                    <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{protocol.title}</CardTitle>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary">{protocol.diseasesite}</Badge>
                              {protocol.stage && <Badge variant="outline">{protocol.stage}</Badge>}
                              <Badge>{protocol.modality}</Badge>
                              <Badge variant="outline" className="capitalize">{protocol.intent}</Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (isFavorited) {
                                removeFavoriteMutation.mutate({ protocolId: protocol.id });
                              } else {
                                addFavoriteMutation.mutate({ protocolId: protocol.id });
                              }
                            }}
                          >
                            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 p-3 bg-muted rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Dose</p>
                            <p className="font-semibold">{protocol.totalDose}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Fractions</p>
                            <p className="font-semibold">{protocol.fractions}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Dose/Fx</p>
                            <p className="font-semibold">{protocol.dosePerFraction}</p>
                          </div>
                        </div>

                        {protocol.clinicalNotes && (
                          <div>
                            <p className="text-sm font-medium mb-1">Clinical Notes:</p>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {protocol.clinicalNotes}
                            </p>
                          </div>
                        )}

                        {protocol.references && (
                          <div>
                            <p className="text-sm font-medium mb-1">References:</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {protocol.references}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => exportProtocolToPDF(protocol)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              // TODO: Open protocol detail modal
                              toast.info("Protocol details coming soon");
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
