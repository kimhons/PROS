import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Lock, Calculator, TrendingUp, Info } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";

// Tissue/tumor type presets with α/β ratios
const tissuePresets = [
  { value: "prostate", label: "Prostate Cancer", alphaβ: 1.5, description: "Low α/β - responds well to hypofractionation" },
  { value: "breast", label: "Breast Cancer", alphaβ: 4.0, description: "Moderate α/β - standard fractionation typical" },
  { value: "lung-nsclc", label: "Lung NSCLC", alphaβ: 10.0, description: "High α/β - conventional or SBRT" },
  { value: "lung-sclc", label: "Lung SCLC", alphaβ: 10.0, description: "High α/β - rapid fractionation" },
  { value: "head-neck", label: "Head & Neck SCC", alphaβ: 10.0, description: "High α/β - standard fractionation" },
  { value: "brain-glioblastoma", label: "Glioblastoma", alphaβ: 10.0, description: "High α/β - standard fractionation" },
  { value: "brain-metastases", label: "Brain Metastases", alphaβ: 10.0, description: "High α/β - SRS or fractionated SRS" },
  { value: "melanoma", label: "Melanoma", alphaβ: 0.6, description: "Very low α/β - hypofractionation beneficial" },
  { value: "rectum", label: "Rectal Cancer", alphaβ: 5.0, description: "Moderate α/β - neoadjuvant RT" },
  { value: "cervix", label: "Cervical Cancer", alphaβ: 10.0, description: "High α/β - with brachytherapy boost" },
  { value: "liver", label: "Liver Tumors", alphaβ: 10.0, description: "High α/β - SBRT common" },
  { value: "pancreas", label: "Pancreatic Cancer", alphaβ: 10.0, description: "High α/β - SBRT or conventional" },
  { value: "kidney", label: "Renal Cell Carcinoma", alphaβ: 8.0, description: "Moderate-high α/β - SBRT effective" },
  { value: "spine-met", label: "Spine Metastases", alphaβ: 8.0, description: "Moderate-high α/β - SBRT common" },
  { value: "late-tissue", label: "Late-Responding Normal Tissue", alphaβ: 3.0, description: "Low α/β - sparing priority" },
  { value: "early-tissue", label: "Early-Responding Normal Tissue", alphaβ: 10.0, description: "High α/β - acute reactions" },
  { value: "custom", label: "Custom α/β Ratio", alphaβ: 10.0, description: "Enter your own α/β value" },
];

export default function BEDCalculator() {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Calculator state
  const [selectedPreset, setSelectedPreset] = useState("prostate");
  const [customAlphaβ, setCustomAlphaβ] = useState(10.0);
  const [totalDose, setTotalDose] = useState(78);
  const [fractions, setFractions] = useState(39);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonDose, setComparisonDose] = useState(60);
  const [comparisonFractions, setComparisonFractions] = useState(20);

  const currentPreset = tissuePresets.find(p => p.value === selectedPreset) || tissuePresets[0];
  const alphaβ = selectedPreset === "custom" ? customAlphaβ : currentPreset.alphaβ;

  // Calculate BED
  const dosePerFraction = totalDose / fractions;
  const bed = fractions * dosePerFraction * (1 + dosePerFraction / alphaβ);
  
  // Calculate EQD2 (Equivalent Dose in 2 Gy fractions)
  const eqd2 = bed / (1 + 2 / alphaβ);
  
  // Comparison calculations
  const comparisonDosePerFraction = comparisonDose / comparisonFractions;
  const comparisonBed = comparisonFractions * comparisonDosePerFraction * (1 + comparisonDosePerFraction / alphaβ);
  const comparisonEqd2 = comparisonBed / (1 + 2 / alphaβ);

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
                <h1 className="text-4xl font-bold mb-4">BED Calculator</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Comprehensive Biologically Effective Dose calculator with tissue-specific presets and EQD2 calculations.
                </p>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign In Required</CardTitle>
                  <CardDescription className="text-base">
                    Create a free account to access our professional radiation oncology tools and resources.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 text-left">
                      <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Tissue-Specific Presets</h4>
                        <p className="text-sm text-muted-foreground">Pre-configured α/β ratios for 15+ tumor types and normal tissues</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <Calculator className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">BED & EQD2 Calculations</h4>
                        <p className="text-sm text-muted-foreground">Calculate biologically effective dose and 2 Gy equivalent dose</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Fractionation Comparison</h4>
                        <p className="text-sm text-muted-foreground">Compare conventional vs hypofractionation vs SBRT regimens</p>
                      </div>
                    </div>
                  </div>

                  <a href={getLoginUrl()}>
                    <Button size="lg" className="w-full text-lg">
                      Sign In to Access Calculator
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

      {/* Calculator Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">BED Calculator</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Calculate Biologically Effective Dose (BED) and EQD2 for different fractionation schemes
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Parameters</CardTitle>
                    <CardDescription>Select tissue type and enter dose/fractionation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="tissue">Tissue/Tumor Type</Label>
                      <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                        <SelectTrigger id="tissue">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tissuePresets.map(preset => (
                            <SelectItem key={preset.value} value={preset.value}>
                              {preset.label} (α/β = {preset.alphaβ})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-2">
                        <Info className="h-3 w-3 inline mr-1" />
                        {currentPreset.description}
                      </p>
                    </div>

                    {selectedPreset === "custom" && (
                      <div>
                        <Label htmlFor="customAlpha">Custom α/β Ratio</Label>
                        <Input
                          id="customAlpha"
                          type="number"
                          step="0.1"
                          value={customAlphaβ}
                          onChange={(e) => setCustomAlphaβ(parseFloat(e.target.value) || 10)}
                        />
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Prescription</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="totalDose">Total Dose (Gy)</Label>
                          <Input
                            id="totalDose"
                            type="number"
                            step="0.1"
                            value={totalDose}
                            onChange={(e) => setTotalDose(parseFloat(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="fractions">Number of Fractions</Label>
                          <Input
                            id="fractions"
                            type="number"
                            value={fractions}
                            onChange={(e) => setFractions(parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div className="p-3 bg-muted rounded">
                          <p className="text-sm font-medium">Dose per Fraction</p>
                          <p className="text-2xl font-bold text-primary">{dosePerFraction.toFixed(2)} Gy</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Compare Fractionation Schemes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!showComparison ? (
                      <Button onClick={() => setShowComparison(true)} variant="outline" className="w-full">
                        Add Comparison
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="compDose">Comparison Total Dose (Gy)</Label>
                          <Input
                            id="compDose"
                            type="number"
                            step="0.1"
                            value={comparisonDose}
                            onChange={(e) => setComparisonDose(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="compFractions">Comparison Fractions</Label>
                          <Input
                            id="compFractions"
                            type="number"
                            value={comparisonFractions}
                            onChange={(e) => setComparisonFractions(parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <Button onClick={() => setShowComparison(false)} variant="ghost" size="sm" className="w-full">
                          Remove Comparison
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="text-2xl">Primary Prescription Results</CardTitle>
                    <CardDescription>
                      {totalDose} Gy in {fractions} fractions ({dosePerFraction.toFixed(2)} Gy/fx)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Biologically Effective Dose (BED)</p>
                      <p className="text-3xl font-bold text-primary">{bed.toFixed(2)} Gy</p>
                    </div>

                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">EQD2 (2 Gy Equivalent Dose)</p>
                      <p className="text-3xl font-bold text-secondary">{eqd2.toFixed(2)} Gy</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ≈ {Math.round(eqd2 / 2)} fractions of 2 Gy
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Calculation Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">α/β ratio:</span>
                          <span className="font-medium">{alphaβ} Gy</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dose per fraction:</span>
                          <span className="font-medium">{dosePerFraction.toFixed(2)} Gy</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Number of fractions:</span>
                          <span className="font-medium">{fractions}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs text-muted-foreground">
                        <strong>Formula:</strong> BED = n × d × (1 + d/(α/β))<br />
                        <strong>EQD2:</strong> BED / (1 + 2/(α/β))
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {showComparison && (
                  <Card className="border-2 border-secondary">
                    <CardHeader>
                      <CardTitle className="text-xl">Comparison Results</CardTitle>
                      <CardDescription>
                        {comparisonDose} Gy in {comparisonFractions} fractions ({comparisonDosePerFraction.toFixed(2)} Gy/fx)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-muted rounded">
                          <p className="text-xs text-muted-foreground mb-1">BED</p>
                          <p className="text-xl font-bold">{comparisonBed.toFixed(2)} Gy</p>
                        </div>
                        <div className="p-3 bg-muted rounded">
                          <p className="text-xs text-muted-foreground mb-1">EQD2</p>
                          <p className="text-xl font-bold">{comparisonEqd2.toFixed(2)} Gy</p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Biological Equivalence</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <span className="text-sm">BED Difference:</span>
                            <Badge variant={Math.abs(bed - comparisonBed) < 5 ? "default" : "secondary"}>
                              {(bed - comparisonBed > 0 ? "+" : "")}{(bed - comparisonBed).toFixed(2)} Gy
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <span className="text-sm">EQD2 Difference:</span>
                            <Badge variant={Math.abs(eqd2 - comparisonEqd2) < 5 ? "default" : "secondary"}>
                              {(eqd2 - comparisonEqd2 > 0 ? "+" : "")}{(eqd2 - comparisonEqd2).toFixed(2)} Gy
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          {Math.abs(bed - comparisonBed) < 5 
                            ? "✓ These regimens are biologically similar" 
                            : "⚠ Significant biological difference between regimens"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                  <CardContent className="py-4">
                    <p className="text-sm">
                      <strong className="text-amber-900 dark:text-amber-100">Clinical Note:</strong>
                      <span className="text-amber-800 dark:text-amber-200"> BED calculations are theoretical models. Clinical outcomes depend on many factors including tumor biology, patient factors, and treatment technique. Always consult clinical guidelines and institutional protocols.</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
