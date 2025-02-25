import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Book,
  Search,
  Download,
  FileText,
  GraduationCap,
  ExternalLink
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const academicResources = [
  {
    institution: "Open Access Resources",
    resources: [
      {
        title: "Time-Saver Standards for Architectural Design",
        author: "Donald Watson",
        year: "2021",
        description: "Comprehensive reference for architectural design data and standards",
        type: "Reference",
        size: "25.3 MB",
        url: "https://www.academia.edu/44951101/Time_Saver_Standards_for_Architectural_Design_Data"
      },
      {
        title: "MIT OpenCourseWare - Architecture",
        author: "MIT",
        year: "2023",
        description: "Free access to MIT's architecture course materials including lectures, assignments, and readings",
        type: "Course Material",
        url: "https://ocw.mit.edu/courses/architecture/"
      },
      {
        title: "Architectural Design Principles",
        author: "Harvard Graduate School of Design",
        year: "2023",
        description: "Open learning initiative covering fundamental principles of architectural design",
        type: "Course Material",
        url: "https://www.gsd.harvard.edu/resources/open-learning"
      }
    ]
  },
  {
    institution: "Technical Resources",
    resources: [
      {
        title: "National Building Code of the Philippines",
        author: "DPWH",
        year: "2023",
        description: "Official building code and implementing rules and regulations",
        type: "Technical Guide",
        url: "https://www.dpwh.gov.ph/dpwh/references/laws_codes_orders/national_building_code"
      },
      {
        title: "Philippine Green Building Code",
        author: "DPWH",
        year: "2023",
        description: "Guidelines for green building design and construction",
        type: "Technical Guide",
        url: "https://www.dpwh.gov.ph/dpwh/references/laws_codes_orders/green_building_code"
      },
      {
        title: "UAP Professional Practice Resources",
        author: "United Architects of the Philippines",
        year: "2024",
        description: "Professional practice guidelines and resources",
        type: "Professional Guide",
        url: "https://united-architects.org.ph/resources-2/"
      }
    ]
  },
  {
    institution: "Educational Videos",
    resources: [
      {
        title: "30x40 Design Workshop",
        author: "Eric Reinholdt",
        year: "2024",
        description: "Comprehensive architectural design tutorials and professional practice guides",
        type: "Video Series",
        url: "https://www.youtube.com/@30x40DesignWorkshop"
      },
      {
        title: "How to Architect",
        author: "Doug Patt",
        year: "2024",
        description: "Educational series covering architectural concepts and professional practice",
        type: "Video Series",
        url: "https://www.youtube.com/@howtoarchitect"
      },
      {
        title: "Architecture License Exam Preparation",
        author: "Young Architect",
        year: "2024",
        description: "ARE exam prep resources and professional development guides",
        type: "Educational Resource",
        url: "https://youngarchitect.com/are-blog/"
      }
    ]
  }
];

export default function EBook() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredResources = academicResources.flatMap(institution =>
    institution.resources.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleResourceClick = (resource: any) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
      toast({
        title: `Opening ${resource.title}`,
        description: "Redirecting to resource page...",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <Book className="h-8 w-8" />
          Architecture Library
        </h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Educational Resources
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {academicResources.map((institution, index) => (
                <AccordionItem key={index} value={`academic-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <div className="text-left">
                        <div>{institution.institution}</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {institution.resources.length} resources available
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {institution.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium mb-1">{resource.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {resource.description}
                              </p>
                              <div className="text-sm text-muted-foreground">
                                <span className="inline-block mr-4">Author: {resource.author}</span>
                                <span className="inline-block">Year: {resource.year}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-4"
                              onClick={() => handleResourceClick(resource)}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        {/* Original Course Content Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Book className="h-5 w-5" />
              Course Content
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {subjects.map((subject, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <subject.icon className="h-5 w-5" />
                      <div className="text-left">
                        <div>{subject.title}</div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {subject.description}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {subject.chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">{chapter.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {chapter.content}
                          </p>
                          {chapter.keyPoints && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Key Points:</h4>
                              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                {chapter.keyPoints.map((point, pointIndex) => (
                                  <li key={pointIndex}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <BackButton />
    </div>
  );
}