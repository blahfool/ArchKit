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
        title: "Building Design and Construction Handbook, 6th Edition",
        author: "Frederick Merritt & Jonathan Ricketts",
        year: "2024",
        description: "Comprehensive handbook covering architectural design, construction methods, and building systems",
        type: "Reference",
        url: "https://archive.org/details/building-construction-handbook-6th-edition"
      },
      {
        title: "Architectural Design Standards - Time Saver Standards",
        author: "Donald Watson",
        year: "2023",
        description: "Essential reference for architectural design data and standards",
        type: "Reference",
        url: "https://www.academia.edu/44951101/Time_Saver_Standards_for_Architectural_Design_Data"
      },
      {
        title: "Architecture Exam Prep by NCARB",
        author: "NCARB",
        year: "2024",
        description: "Official study guides and practice questions for architecture licensing exams",
        type: "Study Material",
        url: "https://www.ncarb.org/study"
      }
    ]
  },
  {
    institution: "Free Online Courses",
    resources: [
      {
        title: "MIT OpenCourseWare - Architecture",
        author: "MIT",
        year: "2024",
        description: "Complete architecture course materials including lectures, assignments, and readings",
        type: "Course Material",
        url: "https://ocw.mit.edu/courses/architecture/"
      },
      {
        title: "edX - Environmental Technologies in Buildings",
        author: "ETH Zurich",
        year: "2024",
        description: "Free course on sustainable building technologies and environmental design",
        type: "Course Material",
        url: "https://www.edx.org/learn/environmental-science/eth-zurich-environmental-technologies-in-buildings"
      },
      {
        title: "Coursera - Construction Management Specialization",
        author: "Columbia University",
        year: "2024",
        description: "Free course series covering construction management principles",
        type: "Course Material",
        url: "https://www.coursera.org/specializations/construction-management"
      }
    ]
  },
  {
    institution: "Exam Preparation Resources",
    resources: [
      {
        title: "Architecture Registration Exam (ARE) Study Materials",
        author: "AIA",
        year: "2024",
        description: "Free study materials and practice questions from the American Institute of Architects",
        type: "Study Material",
        url: "https://www.aia.org/pages/11831-are-resources"
      },
      {
        title: "Young Architect - ARE Exam Prep",
        author: "Michael Riscica",
        year: "2024",
        description: "Free blog posts and study guides for architecture licensing exams",
        type: "Study Material",
        url: "https://youngarchitect.com/are-blog/"
      },
      {
        title: "Building Code Illustrated Guide",
        author: "Francis D.K. Ching",
        year: "2024",
        description: "Visual guide to understanding building codes and regulations",
        type: "Reference",
        url: "https://archive.org/details/building-codes-illustrated"
      }
    ]
  },
  {
    institution: "Professional Practice Resources",
    resources: [
      {
        title: "Architect's Handbook of Professional Practice",
        author: "AIA",
        year: "2024",
        description: "Comprehensive guide to architectural professional practice",
        type: "Reference",
        url: "https://archive.org/details/architects-handbook-professional-practice"
      },
      {
        title: "Construction Specifications Writing Guide",
        author: "CSI",
        year: "2024",
        description: "Guide to writing construction specifications and contract documents",
        type: "Reference",
        url: "https://www.csinet.org/learning-education"
      },
      {
        title: "Architecture Drawing Course",
        author: "OpenLearn",
        year: "2024",
        description: "Free course materials for architectural drawing and visualization",
        type: "Course Material",
        url: "https://www.open.edu/openlearn/science-maths-technology/engineering-technology/architectural-drawing"
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