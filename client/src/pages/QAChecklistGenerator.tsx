import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Lock, Download, Save, FileText, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

// TG-142 Daily QA Template
const tg142DailyTemplate = {
  name: "TG-142 Daily QA - Linear Accelerator",
  category: "machine-qa",
  tgReport: "TG-142",
  frequency: "daily",
  description: "Daily quality assurance checks for linear accelerators per AAPM TG-142 recommendations",
  items: [
    { id: "laser", label: "Lasers", tolerance: "±2 mm", checked: false, result: "", notes: "" },
    { id: "odu", label: "ODU (Optical Distance Indicator)", tolerance: "±2 mm", checked: false, result: "", notes: "" },
    { id: "collision", label: "Collision Interlocks", tolerance: "Functional", checked: false, result: "", notes: "" },
    { id: "door-interlock", label: "Door Interlock", tolerance: "Functional", checked: false, result: "", notes: "" },
    { id: "audio-visual", label: "Audio/Visual Monitors", tolerance: "Functional", checked: false, result: "", notes: "" },
    { id: "dosimetry", label: "Dosimetry System Constancy", tolerance: "±3%", checked: false, result: "", notes: "" },
    { id: "backup-monitor", label: "Backup Monitor Unit Check", tolerance: "±5%", checked: false, result: "", notes: "" },
    { id: "safety-interlocks", label: "Safety Interlocks", tolerance: "Functional", checked: false, result: "", notes: "" },
  ],
};

// TG-142 Monthly QA Template
const tg142MonthlyTemplate = {
  name: "TG-142 Monthly QA - Linear Accelerator",
  category: "machine-qa",
  tgReport: "TG-142",
  frequency: "monthly",
  description: "Monthly quality assurance checks for linear accelerators per AAPM TG-142 recommendations",
  items: [
    { id: "x-ray-output", label: "X-ray Output Constancy", tolerance: "±2%", checked: false, result: "", notes: "" },
    { id: "electron-output", label: "Electron Output Constancy", tolerance: "±2%", checked: false, result: "", notes: "" },
    { id: "beam-profile", label: "Beam Profile Constancy (Flatness/Symmetry)", tolerance: "±2%", checked: false, result: "", notes: "" },
    { id: "light-rad-coincidence", label: "Light/Radiation Field Coincidence", tolerance: "±2 mm", checked: false, result: "", notes: "" },
    { id: "jaw-position", label: "Jaw Position Indicators", tolerance: "±2 mm", checked: false, result: "", notes: "" },
    { id: "gantry-angle", label: "Gantry/Collimator Angle Indicators", tolerance: "±1°", checked: false, result: "", notes: "" },
    { id: "table-position", label: "Treatment Couch Position Indicators", tolerance: "±2 mm", checked: false, result: "", notes: "" },
    { id: "accessory-tray", label: "Accessory Trays", tolerance: "Functional", checked: false, result: "", notes: "" },
    { id: "mlc-position", label: "MLC Position Accuracy", tolerance: "±2 mm", checked: false, result: "", notes: "" },
  ],
};

// TG-142 Annual QA Template
const tg142AnnualTemplate = {
  name: "TG-142 Annual QA - Linear Accelerator",
  category: "machine-qa",
  tgReport: "TG-142",
  frequency: "annual",
  description: "Annual quality assurance checks for linear accelerators per AAPM TG-142 recommendations",
  items: [
    { id: "beam-quality", label: "Photon Beam Quality (PDD10 or TPR20,10)", tolerance: "±1%", checked: false, result: "", notes: "" },
    { id: "electron-energy", label: "Electron Beam Energy (R50)", tolerance: "±2 mm", checked: false, result: "", notes: "" },
    { id: "arc-rotation", label: "Arc Rotation Mode", tolerance: "±1°", checked: false, result: "", notes: "" },
    { id: "total-scatter", label: "Total Scatter Factors", tolerance: "±2%", checked: false, result: "", notes: "" },
    { id: "transmission", label: "Transmission Factor", tolerance: "±0.5%", checked: false, result: "", notes: "" },
    { id: "wedge-factor", label: "Wedge Transmission Factor", tolerance: "±2%", checked: false, result: "", notes: "" },
    { id: "off-axis-factor", label: "Off-Axis Factor", tolerance: "±2%", checked: false, result: "", notes: "" },
    { id: "mlc-transmission", label: "MLC Transmission", tolerance: "±0.5%", checked: false, result: "", notes: "" },
    { id: "safety-devices", label: "Safety Devices (Emergency Off, Beam-On Indicators)", tolerance: "Functional", checked: false, result: "", notes: "" },
  ],
};

// TG-51 Template
const tg51Template = {
  name: "TG-51 Reference Dosimetry - Photon Beams",
  category: "reference-dosimetry",
  tgReport: "TG-51",
  frequency: "annual",
  description: "Reference dosimetry protocol for photon beam calibration per AAPM TG-51",
  items: [
    { id: "chamber-setup", label: "Ion Chamber Setup (Type, Serial Number)", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "electrometer", label: "Electrometer (Type, Serial Number)", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "phantom", label: "Phantom Setup (Water/Solid, Dimensions)", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "temp-pressure", label: "Temperature and Pressure Measurement", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "depth-measurement", label: "Depth of Measurement (dmax or dref)", tolerance: "±1 mm", checked: false, result: "", notes: "" },
    { id: "pdd-measurement", label: "PDD(10) or TPR20,10 Measurement", tolerance: "±1%", checked: false, result: "", notes: "" },
    { id: "kq-determination", label: "Beam Quality Correction Factor (kQ)", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "nd-w-calibration", label: "ND,w Calibration Factor", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "dose-calculation", label: "Absorbed Dose to Water Calculation", tolerance: "±2%", checked: false, result: "", notes: "" },
    { id: "output-adjustment", label: "Machine Output Adjustment", tolerance: "±1%", checked: false, result: "", notes: "" },
  ],
};

// TG-100 Template
const tg100Template = {
  name: "TG-100 Quality Management Program",
  category: "quality-management",
  tgReport: "TG-100",
  frequency: "as-needed",
  description: "Quality management framework for radiation oncology physics per AAPM TG-100",
  items: [
    { id: "process-map", label: "Process Map Development", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "fmea-analysis", label: "Failure Modes and Effects Analysis (FMEA)", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "risk-assessment", label: "Risk Assessment (RPN Calculation)", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "qc-procedures", label: "QC Procedures for High-Risk Steps", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "incident-learning", label: "Incident Learning System", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "staff-training", label: "Staff Training and Competency", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "documentation", label: "Documentation and Record Keeping", tolerance: "N/A", checked: false, result: "", notes: "" },
    { id: "continuous-improvement", label: "Continuous Quality Improvement", tolerance: "N/A", checked: false, result: "", notes: "" },
  ],
};

const templates = [
  tg142DailyTemplate,
  tg142MonthlyTemplate,
  tg142AnnualTemplate,
  tg51Template,
  tg100Template,
];

export default function QAChecklistGenerator() {
  const { user, loading, isAuthenticated } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [equipmentId, setEquipmentId] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [performedDate, setPerformedDate] = useState(new Date().toISOString().split('T')[0]);
  const [generalNotes, setGeneralNotes] = useState("");

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setChecklistItems(template.items.map((item: any) => ({ ...item })));
  };

  const handleItemCheck = (index: number, checked: boolean) => {
    const updated = [...checklistItems];
    updated[index].checked = checked;
    setChecklistItems(updated);
  };

  const handleItemResult = (index: number, result: string) => {
    const updated = [...checklistItems];
    updated[index].result = result;
    setChecklistItems(updated);
  };

  const handleItemNotes = (index: number, notes: string) => {
    const updated = [...checklistItems];
    updated[index].notes = notes;
    setChecklistItems(updated);
  };

  const exportChecklist = () => {
    if (!selectedTemplate) return;

    const passedItems = checklistItems.filter(item => item.checked).length;
    const totalItems = checklistItems.length;
    const completionRate = ((passedItems / totalItems) * 100).toFixed(1);

    const checklistContent = `
PRECISION RADIATION ONCOLOGY SOLUTIONS
Quality Assurance Checklist
${'='.repeat(80)}

${selectedTemplate.name}
${selectedTemplate.tgReport ? `AAPM ${selectedTemplate.tgReport}` : ''}

${'='.repeat(80)}
CHECKLIST INFORMATION
${'='.repeat(80)}

Equipment ID: ${equipmentId || 'Not specified'}
Performed By: ${performedBy || user?.name || 'Not specified'}
Performed Date: ${performedDate}
Frequency: ${selectedTemplate.frequency?.toUpperCase() || 'N/A'}

Description: ${selectedTemplate.description}

${'='.repeat(80)}
CHECKLIST ITEMS (${passedItems}/${totalItems} Completed - ${completionRate}%)
${'='.repeat(80)}

${checklistItems.map((item, idx) => `
${idx + 1}. ${item.label}
   Tolerance: ${item.tolerance}
   Status: ${item.checked ? '✓ PASS' : '✗ NOT CHECKED'}
   ${item.result ? `Result: ${item.result}` : ''}
   ${item.notes ? `Notes: ${item.notes}` : ''}
`).join('\n')}

${generalNotes ? `
${'='.repeat(80)}
GENERAL NOTES
${'='.repeat(80)}

${generalNotes}
` : ''}

${'='.repeat(80)}
SIGNATURE
${'='.repeat(80)}

Performed By: _________________________ Date: _____________

Reviewed By: _________________________ Date: _____________

${'='.repeat(80)}

This checklist was generated using the PROS QA Checklist Generator.
For more information, visit: https://pros-staffing.com

© ${new Date().getFullYear()} Precision Radiation Oncology Solutions
    `;

    const blob = new Blob([checklistContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QA_Checklist_${selectedTemplate.tgReport || 'Custom'}_${equipmentId || 'Equipment'}_${performedDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Checklist exported successfully");
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
                <h1 className="text-4xl font-bold mb-4">QA Checklist Generator</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Generate customized quality assurance checklists based on AAPM TG reports and best practices.
                </p>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign In Required</CardTitle>
                  <CardDescription className="text-base">
                    Create a free account to access our QA checklist templates and generator.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 text-left">
                      <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">AAPM TG Report Templates</h4>
                        <p className="text-sm text-muted-foreground">Pre-built templates for TG-142, TG-51, TG-100, and more</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <CheckSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Customizable Checklists</h4>
                        <p className="text-sm text-muted-foreground">Add notes, results, and equipment-specific details</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <Download className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Export & Save</h4>
                        <p className="text-sm text-muted-foreground">Download checklists as formatted documents and track completion history</p>
                      </div>
                    </div>
                  </div>

                  <a href={getLoginUrl()}>
                    <Button size="lg" className="w-full text-lg">
                      Sign In to Access Generator
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

      {/* QA Checklist Generator Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckSquare className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">QA Checklist Generator</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Generate customized quality assurance checklists based on AAPM TG reports
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Template Selection */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Template</CardTitle>
                    <CardDescription>Choose from AAPM TG report templates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {templates.map((template, idx) => (
                      <Card
                        key={idx}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate?.name === template.name ? 'border-primary border-2' : ''
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{template.tgReport || 'Custom'}</h4>
                            <Badge variant="secondary" className="text-xs">{template.frequency}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                          <p className="text-xs text-primary mt-2">{template.items.length} items</p>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Checklist Builder */}
              <div className="lg:col-span-2">
                {!selectedTemplate ? (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Select a Template</h3>
                      <p className="text-muted-foreground">
                        Choose a QA checklist template from the left to get started
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Checklist Header */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{selectedTemplate.name}</CardTitle>
                            <CardDescription>{selectedTemplate.description}</CardDescription>
                          </div>
                          <Badge>{selectedTemplate.tgReport}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="equipmentId">Equipment ID</Label>
                            <Input
                              id="equipmentId"
                              placeholder="e.g., Linac 1, TrueBeam STx"
                              value={equipmentId}
                              onChange={(e) => setEquipmentId(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="performedBy">Performed By</Label>
                            <Input
                              id="performedBy"
                              placeholder={user?.name || "Your name"}
                              value={performedBy}
                              onChange={(e) => setPerformedBy(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="performedDate">Date</Label>
                            <Input
                              id="performedDate"
                              type="date"
                              value={performedDate}
                              onChange={(e) => setPerformedDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Checklist Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Checklist Items</CardTitle>
                        <CardDescription>
                          {checklistItems.filter(item => item.checked).length} of {checklistItems.length} items completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {checklistItems.map((item, idx) => (
                          <Card key={idx} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3 mb-3">
                                <Checkbox
                                  id={`item-${idx}`}
                                  checked={item.checked}
                                  onCheckedChange={(checked) => handleItemCheck(idx, checked as boolean)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <Label htmlFor={`item-${idx}`} className="font-semibold cursor-pointer">
                                    {item.label}
                                  </Label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Tolerance: <span className="font-medium">{item.tolerance}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="grid md:grid-cols-2 gap-3 ml-7">
                                <div>
                                  <Label htmlFor={`result-${idx}`} className="text-xs">Result/Measurement</Label>
                                  <Input
                                    id={`result-${idx}`}
                                    placeholder="Enter result"
                                    value={item.result}
                                    onChange={(e) => handleItemResult(idx, e.target.value)}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`notes-${idx}`} className="text-xs">Notes</Label>
                                  <Input
                                    id={`notes-${idx}`}
                                    placeholder="Optional notes"
                                    value={item.notes}
                                    onChange={(e) => handleItemNotes(idx, e.target.value)}
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>

                    {/* General Notes */}
                    <Card>
                      <CardHeader>
                        <CardTitle>General Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Add any general notes, observations, or follow-up actions..."
                          value={generalNotes}
                          onChange={(e) => setGeneralNotes(e.target.value)}
                          rows={4}
                        />
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="bg-primary/5">
                      <CardContent className="py-6">
                        <div className="flex flex-wrap gap-3">
                          <Button onClick={exportChecklist} className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Export Checklist
                          </Button>
                          <Button variant="outline" className="flex-1" onClick={() => toast.info("Save feature coming soon")}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Draft
                          </Button>
                        </div>
                        <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-blue-900 dark:text-blue-100">
                            <strong>Note:</strong> This checklist generator is for reference purposes. Always follow your institution's specific QA procedures and regulatory requirements.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
