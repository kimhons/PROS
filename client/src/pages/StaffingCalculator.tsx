import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Lock, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";

export default function StaffingCalculator() {
  const { user, loading, isAuthenticated } = useAuth();
  
  // Calculator state
  const [inputs, setInputs] = useState({
    annualPatients: 0,
    imrt: 0,
    sbrt: 0,
    srs: 0,
    proton: 0,
    brachytherapy: 0,
    linacs: 0,
  });

  const [results, setResults] = useState<any>(null);

  const calculateStaffing = () => {
    // ASTRO/AAPM guideline-based calculations
    const annualPatients = inputs.annualPatients;
    const complexCases = inputs.imrt + inputs.sbrt + inputs.srs + inputs.proton;
    
    // Medical Physicist FTE (AAPM TG-268 guidelines)
    // Base: 1 FTE per 400-500 patients
    // Additional: 0.2 FTE per 100 IMRT/VMAT, 0.3 FTE per 100 SBRT/SRS
    const basePhysicistFTE = annualPatients / 450;
    const complexPhysicistFTE = (inputs.imrt / 100) * 0.2 + (inputs.sbrt + inputs.srs) / 100 * 0.3;
    const protonPhysicistFTE = inputs.proton > 0 ? (inputs.proton / 100) * 0.4 : 0;
    const totalPhysicistFTE = Math.ceil((basePhysicistFTE + complexPhysicistFTE + protonPhysicistFTE) * 10) / 10;

    // Dosimetrist FTE (ASTRO guidelines)
    // Base: 1 FTE per 250-300 patients
    // Additional: 0.15 FTE per 100 complex cases
    const baseDosimetristFTE = annualPatients / 275;
    const complexDosimetristFTE = complexCases / 100 * 0.15;
    const totalDosimetristFTE = Math.ceil((baseDosimetristFTE + complexDosimetristFTE) * 10) / 10;

    // Radiation Therapist FTE (ASTRO guidelines)
    // Base: 2-3 therapists per linac (assuming 8-hour shifts)
    // Additional: 0.5 FTE per 200 complex cases
    const baseTherapistFTE = inputs.linacs * 2.5;
    const complexTherapistFTE = complexCases / 200 * 0.5;
    const totalTherapistFTE = Math.ceil((baseTherapistFTE + complexTherapistFTE) * 10) / 10;

    // Oncology Nurse FTE
    // Base: 1 FTE per 300-400 patients
    const totalNurseFTE = Math.ceil((annualPatients / 350) * 10) / 10;

    // Support Staff FTE (schedulers, front desk, etc.)
    const totalSupportFTE = Math.ceil((annualPatients / 500) * 10) / 10;

    setResults({
      physicist: totalPhysicistFTE,
      dosimetrist: totalDosimetristFTE,
      therapist: totalTherapistFTE,
      nurse: totalNurseFTE,
      support: totalSupportFTE,
      total: totalPhysicistFTE + totalDosimetristFTE + totalTherapistFTE + totalNurseFTE + totalSupportFTE,
      breakdown: {
        physicist: {
          base: Math.round(basePhysicistFTE * 10) / 10,
          complex: Math.round(complexPhysicistFTE * 10) / 10,
          proton: Math.round(protonPhysicistFTE * 10) / 10,
        },
        dosimetrist: {
          base: Math.round(baseDosimetristFTE * 10) / 10,
          complex: Math.round(complexDosimetristFTE * 10) / 10,
        },
        therapist: {
          base: Math.round(baseTherapistFTE * 10) / 10,
          complex: Math.round(complexTherapistFTE * 10) / 10,
        },
      },
    });
  };

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
                <h1 className="text-4xl font-bold mb-4">Staffing Calculator</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Calculate optimal staffing levels for your radiation oncology department based on ASTRO and AAPM guidelines.
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
                      <Calculator className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">ASTRO/AAPM Guideline-Based</h4>
                        <p className="text-sm text-muted-foreground">Calculations based on industry-standard staffing ratios and complexity factors</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Comprehensive FTE Breakdown</h4>
                        <p className="text-sm text-muted-foreground">Detailed staffing requirements for physicists, dosimetrists, therapists, and support staff</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Modality-Specific Adjustments</h4>
                        <p className="text-sm text-muted-foreground">Account for IMRT, SBRT, SRS, proton therapy, and brachytherapy complexity</p>
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
                <Calculator className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Radiation Oncology Staffing Calculator</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Calculate optimal staffing levels based on ASTRO and AAPM guidelines (TG-268, ASTRO Model Policies)
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Information</CardTitle>
                  <CardDescription>Enter your annual patient volume and treatment modalities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="annualPatients">Annual Patient Volume *</Label>
                    <Input
                      id="annualPatients"
                      type="number"
                      value={inputs.annualPatients || ''}
                      onChange={(e) => setInputs({ ...inputs, annualPatients: parseInt(e.target.value) || 0 })}
                      placeholder="e.g., 500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linacs">Number of Linear Accelerators *</Label>
                    <Input
                      id="linacs"
                      type="number"
                      value={inputs.linacs || ''}
                      onChange={(e) => setInputs({ ...inputs, linacs: parseInt(e.target.value) || 0 })}
                      placeholder="e.g., 2"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Complex Treatment Modalities (Annual)</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="imrt">IMRT/VMAT Cases</Label>
                        <Input
                          id="imrt"
                          type="number"
                          value={inputs.imrt || ''}
                          onChange={(e) => setInputs({ ...inputs, imrt: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 200"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sbrt">SBRT Cases</Label>
                        <Input
                          id="sbrt"
                          type="number"
                          value={inputs.sbrt || ''}
                          onChange={(e) => setInputs({ ...inputs, sbrt: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="srs">SRS Cases</Label>
                        <Input
                          id="srs"
                          type="number"
                          value={inputs.srs || ''}
                          onChange={(e) => setInputs({ ...inputs, srs: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 30"
                        />
                      </div>

                      <div>
                        <Label htmlFor="proton">Proton Therapy Cases</Label>
                        <Input
                          id="proton"
                          type="number"
                          value={inputs.proton || ''}
                          onChange={(e) => setInputs({ ...inputs, proton: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 0"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brachytherapy">Brachytherapy Cases</Label>
                        <Input
                          id="brachytherapy"
                          type="number"
                          value={inputs.brachytherapy || ''}
                          onChange={(e) => setInputs({ ...inputs, brachytherapy: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 20"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={calculateStaffing} className="w-full" size="lg">
                    Calculate Staffing Requirements
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {!results && (
                  <Card className="border-2 border-dashed">
                    <CardContent className="py-12 text-center">
                      <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        Enter your department information and click "Calculate" to see staffing recommendations.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {results && (
                  <>
                    <Card className="border-2 border-primary">
                      <CardHeader>
                        <CardTitle className="text-2xl">Recommended Staffing</CardTitle>
                        <CardDescription>Based on ASTRO/AAPM guidelines</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                          <span className="font-semibold text-lg">Total FTE Required</span>
                          <Badge variant="default" className="text-2xl px-4 py-2">{results.total.toFixed(1)}</Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                            <span className="font-medium">Medical Physicists</span>
                            <span className="text-lg font-semibold">{results.physicist.toFixed(1)} FTE</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                            <span className="font-medium">Dosimetrists</span>
                            <span className="text-lg font-semibold">{results.dosimetrist.toFixed(1)} FTE</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                            <span className="font-medium">Radiation Therapists</span>
                            <span className="text-lg font-semibold">{results.therapist.toFixed(1)} FTE</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                            <span className="font-medium">Oncology Nurses</span>
                            <span className="text-lg font-semibold">{results.nurse.toFixed(1)} FTE</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                            <span className="font-medium">Support Staff</span>
                            <span className="text-lg font-semibold">{results.support.toFixed(1)} FTE</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Calculation Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Medical Physicists ({results.physicist.toFixed(1)} FTE)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Base staffing: {results.breakdown.physicist.base} FTE</li>
                            <li>• Complex cases adjustment: +{results.breakdown.physicist.complex} FTE</li>
                            {results.breakdown.physicist.proton > 0 && (
                              <li>• Proton therapy: +{results.breakdown.physicist.proton} FTE</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Dosimetrists ({results.dosimetrist.toFixed(1)} FTE)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Base staffing: {results.breakdown.dosimetrist.base} FTE</li>
                            <li>• Complex cases adjustment: +{results.breakdown.dosimetrist.complex} FTE</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Radiation Therapists ({results.therapist.toFixed(1)} FTE)</h4>
                          <ul className="space-y-1 text-muted-foreground ml-4">
                            <li>• Base staffing (linacs): {results.breakdown.therapist.base} FTE</li>
                            <li>• Complex cases adjustment: +{results.breakdown.therapist.complex} FTE</li>
                          </ul>
                        </div>
                        <div className="pt-4 border-t">
                          <p className="text-xs text-muted-foreground">
                            <strong>Note:</strong> These calculations are based on AAPM TG-268 and ASTRO Model Policies. 
                            Actual staffing needs may vary based on facility-specific factors, equipment, workflows, and patient complexity.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="py-6">
                        <h4 className="font-semibold mb-3">Need Help with Staffing?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          PROS can provide qualified radiation oncology professionals to meet your staffing requirements.
                        </p>
                        <Link href="/contact">
                          <Button variant="default" className="w-full">
                            Contact Our Staffing Team
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
