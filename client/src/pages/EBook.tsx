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
  FileText,
  GraduationCap,
  ExternalLink
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const academicResources = [
  {
    institution: "NCARB Resources",
    resources: [
      {
        title: "NCARB Official Study Resources",
        author: "NCARB",
        year: "2024",
        description: "Comprehensive collection of official study materials, practice exams, and guidelines for architecture licensing exams",
        type: "Study Material",
        url: "https://www.ncarb.org/data-resources/all/study-resources"
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
      </div>
      <BackButton />
    </div>
  );
}