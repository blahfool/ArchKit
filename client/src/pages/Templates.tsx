import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import BackButton from "@/components/BackButton";
import { saveAs } from 'file-saver';
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: number;
  title: string;
  description: string;
  type: 'presentation' | 'document' | 'drawing';
  downloadUrl: string;
  format: string;
}

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  category: string;
  content: string;
  downloadUrl: string;
  format: string;
}

// Sample base64 encoded text content for demo purposes
const getDemoContent = (title: string) => {
  return btoa(`Sample content for ${title}\n\nThis is a demonstration template.`);
};

const templates: Template[] = [
  {
    id: 1,
    title: "Project Presentation Template",
    description: "Professional template for architectural project presentations including sections for site analysis, concept development, and technical details",
    type: "presentation",
    downloadUrl: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${getDemoContent("Project Presentation")}`,
    format: "pptx"
  },
  {
    id: 2,
    title: "Technical Documentation Template",
    description: "Comprehensive template for technical documentation with pre-formatted sections for specifications, materials, and construction details",
    type: "document",
    downloadUrl: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${getDemoContent("Technical Documentation")}`,
    format: "docx"
  },
  {
    id: 3,
    title: "Construction Drawing Template",
    description: "CAD template with standard layouts, title blocks, and common architectural symbols",
    type: "drawing",
    downloadUrl: `data:application/acad;base64,${getDemoContent("Construction Drawing")}`,
    format: "dwg"
  },
  {
    id: 4,
    title: "Building Permit Application Package",
    description: "Complete template set for building permit applications including forms, checklists, and required documentation",
    type: "document",
    downloadUrl: `data:application/pdf;base64,${getDemoContent("Building Permit Package")}`,
    format: "pdf"
  },
  {
    id: 5,
    title: "Project Proposal Template",
    description: "Professional template for architectural project proposals including budget estimates and timelines",
    type: "document",
    downloadUrl: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${getDemoContent("Project Proposal")}`,
    format: "docx"
  }
];

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Sustainable Urban Housing Development",
    description: "A comprehensive case study of a mixed-use development incorporating sustainable design principles",
    category: "Residential",
    content: "This case study examines the development of a sustainable urban housing project...",
    downloadUrl: `data:application/pdf;base64,${getDemoContent("Sustainable Housing Case Study")}`,
    format: "pdf"
  },
  {
    id: 2,
    title: "Heritage Building Restoration",
    description: "Detailed analysis of a heritage building restoration project highlighting conservation techniques",
    category: "Conservation",
    content: "The restoration project involved careful preservation of historical elements...",
    downloadUrl: `data:application/pdf;base64,${getDemoContent("Heritage Restoration Case Study")}`,
    format: "pdf"
  },
  {
    id: 3,
    title: "Green Building Implementation",
    description: "Case study on implementing LEED certification requirements in a commercial building",
    category: "Sustainability",
    content: "This study explores the process of achieving LEED certification...",
    downloadUrl: `data:application/pdf;base64,${getDemoContent("Green Building Case Study")}`,
    format: "pdf"
  }
];

export default function Templates() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("templates");
  const { toast } = useToast();

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(search.toLowerCase()) ||
    template.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCaseStudies = caseStudies.filter(study =>
    study.title.toLowerCase().includes(search.toLowerCase()) ||
    study.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (item: Template | CaseStudy) => {
    try {
      // Extract the base64 data
      const base64Data = item.downloadUrl.split(',')[1];
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `application/${item.format}` });

      // Download the file
      saveAs(blob, `${item.title.toLowerCase().replace(/\s+/g, '-')}.${item.format}`);

      toast({
        title: "Download Started",
        description: `${item.title} is being downloaded to your device.`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Templates & Case Studies
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search templates and case studies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTemplates.map(template => (
                <Card key={template.id}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{template.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground capitalize">
                        {template.type} • {template.format.toUpperCase()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(template)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="case-studies">
            <div className="space-y-4">
              {filteredCaseStudies.map(study => (
                <Card key={study.id}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{study.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {study.description}
                    </p>
                    <div className="text-sm text-muted-foreground mb-4">
                      Category: {study.category}
                    </div>
                    <p className="text-sm mb-4">{study.content}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(study)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Case Study
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BackButton />
    </div>
  );
}