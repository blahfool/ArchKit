import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  Search,
  Book,
  CheckSquare,
  Globe,
  ArrowRight,
  AlertTriangle,
  Shield,
  Building,
  Flame,
  Download
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

interface CodeSection {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  references: string[];
}

export default function BuildingCodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState<CodeSection | null>(null);
  const { toast } = useToast();

  const codeSections: Record<string, CodeSection[]> = {
    "NBCP Requirements": [
      {
        id: "nbcp-1",
        title: "General Building Requirements",
        description: "National Building Code of the Philippines (NBCP) - P.D. 1096 general requirements for building design and construction",
        requirements: [
          "Building Height and Floor Area Requirements",
          "Fire Safety and Protection Systems",
          "Structural Design Requirements",
          "Sanitation and Plumbing Requirements",
          "Electrical and Mechanical Requirements"
        ],
        references: ["NBCP P.D. 1096", "IRR of P.D. 1096"]
      },
      {
        id: "nbcp-2",
        title: "Occupancy Classifications",
        description: "Building occupancy classifications according to NBCP",
        requirements: [
          "Group A - Residential",
          "Group B - Educational",
          "Group C - Institutional",
          "Group D - Commercial",
          "Group E - Industrial",
          "Group F - Storage and Hazardous",
          "Group G - Miscellaneous",
          "Group H - Assembly",
          "Group I - Agricultural"
        ],
        references: ["NBCP Rule VII", "DPWH Guidelines"]
      }
    ],
    "Green Building Requirements": [
      {
        id: "green-1",
        title: "Philippine Green Building Code",
        description: "Mandatory standards for planning, design, construction, and management of buildings in the Philippines",
        requirements: [
          "Energy Efficiency and Conservation",
          "Water Conservation and Management",
          "Material Sustainability",
          "Solid Waste Management",
          "Site Sustainability",
          "Indoor Environmental Quality"
        ],
        references: ["Philippine Green Building Code 2015", "BERDE Program Guidelines"]
      }
    ],
    "Local Building Regulations": [
      {
        id: "local-1",
        title: "Zoning and Land Use",
        description: "Local government requirements for zoning and land use",
        requirements: [
          "Comprehensive Land Use Plan (CLUP)",
          "Floor Area Ratio (FAR)",
          "Setback Requirements",
          "Building Height Restrictions",
          "Parking Requirements"
        ],
        references: ["Local Government Code", "HLURB Guidelines"]
      }
    ]
  };

  const runComplianceCheck = () => {
    toast({
      title: "Compliance Check Started",
      description: "Automated compliance checking will be available in the next update."
    });
  };

  const generateCodeSummary = (section: CodeSection) => {
    const content = `
# ${section.title}
${section.description}

## Requirements
${section.requirements.map(req => `- ${req}`).join('\n')}

## References
${section.references.map(ref => `- ${ref}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${section.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Summary Generated",
      description: "Code summary has been downloaded successfully."
    });
  };

  const regions = [
    { id: 'ncr', name: 'National Capital Region' },
    { id: 'region3', name: 'Central Luzon' },
    { id: 'region4a', name: 'CALABARZON' },
    { id: 'region7', name: 'Central Visayas' }
  ];

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isRegionalOpen, setIsRegionalOpen] = useState(false);

  const handleRegionalGuide = (region: string) => {
    toast({
      title: `${region} Building Codes`,
      description: "Regional building codes will be available in the next update."
    });
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Building Code Navigator</h1>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-9"
                placeholder="Search building codes, regulations, or standards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-auto py-4 px-6">
                    <Book className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Code Library</div>
                      <div className="text-sm text-muted-foreground">Browse all codes</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Code Library</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {Object.entries(codeSections).map(([category, sections]) => (
                      <div key={category}>
                        <h3 className="font-medium mb-2">{category}</h3>
                        <div className="space-y-2">
                          {sections.map(section => (
                            <Card key={section.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">{section.title}</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => generateCodeSummary(section)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {section.description}
                                </p>
                                <div className="text-sm">
                                  <strong>References:</strong> {section.references.join(', ')}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isComplianceOpen} onOpenChange={setIsComplianceOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-auto py-4 px-6" onClick={runComplianceCheck}>
                    <CheckSquare className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Compliance Check</div>
                      <div className="text-sm text-muted-foreground">Verify requirements</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Compliance Checker</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <p className="text-muted-foreground">
                      Select building type and requirements to check compliance
                    </p>
                    {/* Add compliance checker form here in next iteration */}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isRegionalOpen} onOpenChange={setIsRegionalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-auto py-4 px-6">
                    <Globe className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Regional Guides</div>
                      <div className="text-sm text-muted-foreground">Local regulations</div>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Regional Building Codes</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 pt-4">
                    {regions.map(region => (
                      <Button
                        key={region.id}
                        variant="outline"
                        className="justify-start h-auto py-4"
                        onClick={() => handleRegionalGuide(region.name)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{region.name}</div>
                          <div className="text-sm text-muted-foreground">
                            View local building codes and regulations
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {Object.entries(codeSections).map(([category, sections], index) => {
                const filteredSections = sections.filter(section =>
                  section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  section.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()))
                );

                if (searchTerm && filteredSections.length === 0) return null;

                return (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        {category === "Building Planning and Design" && <Building className="h-5 w-5" />}
                        {category === "Structural Provisions" && <Shield className="h-5 w-5" />}
                        {category === "Fire Safety" && <Flame className="h-5 w-5" />}
                        {category === "NBCP Requirements" && <Shield className="h-5 w-5" />}
                        {category === "Green Building Requirements" && <Globe className="h-5 w-5" />}
                        {category === "Local Building Regulations" && <Building className="h-5 w-5" />}
                        <span>{category}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {(searchTerm ? filteredSections : sections).map((section) => (
                          <Dialog key={section.id}>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => setSelectedSection(section)}
                              >
                                <ArrowRight className="h-4 w-4 mr-2" />
                                {section.title}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{section.title}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                <p className="text-muted-foreground">
                                  {section.description}
                                </p>

                                <div>
                                  <h3 className="font-medium mb-2">Requirements:</h3>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {section.requirements.map((req, idx) => (
                                      <li key={idx} className="text-sm text-muted-foreground">
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h3 className="font-medium mb-2">References:</h3>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {section.references.map((ref, idx) => (
                                      <li key={idx} className="text-sm text-muted-foreground">
                                        {ref}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-muted/50 p-3 rounded-lg flex items-start gap-2">
                                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                  <div className="text-sm">
                                    <span className="font-medium">Important Note:</span>
                                    <p>Always verify requirements with local jurisdiction and current code versions.</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <BackButton />
    </div>
  );
}