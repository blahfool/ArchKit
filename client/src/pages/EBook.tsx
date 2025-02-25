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
  Building2,
  Compass,
  PenSquare,
  Trees,
  Ruler,
  PaintBucket,
  History,
  Building,
  Lightbulb,
  Briefcase,
  Book,
  Search,
  Download,
  FileText,
  GraduationCap
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import StudyNotes from "@/components/StudyNotes";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from 'file-saver';

interface Chapter {
  title: string;
  content: string;
  keyPoints?: string[];
}

interface Subject {
  title: string;
  icon: any;
  description: string;
  chapters: Chapter[];
}

const handleDownload = (resource: any) => {
  if (resource.url) {
    window.open(resource.url, '_blank');
    toast({
      title: `Accessing ${resource.title}`,
      description: `You will be redirected to the official source to access this resource.`
    });
  } else if (resource.downloadUrl) {
    const link = document.createElement('a');
    link.href = resource.downloadUrl;
    link.download = `${resource.title.toLowerCase().replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: `${resource.title} is being downloaded to your device.`
    });
  } else {
    toast({
      title: "Resource Unavailable",
      description: "This resource is currently unavailable. Please check back later.",
      variant: "destructive"
    });
  }
};

const academicResources = [
  {
    institution: "Professional Resources",
    resources: [
      {
        title: "BERDE Guidelines v2.2.0",
        author: "Philippine Green Building Council",
        year: "2023",
        description: "Latest BERDE Guidelines for sustainable building practices in the Philippines",
        type: "Technical Guide",
        size: "8.5 MB",
        tags: ["Sustainability", "Standards"],
        downloadUrl: "https://philgbc.org/download/BERDE-Guidelines-v2.2.0.pdf"
      },
      {
        title: "UAP Professional Practice Guidelines 2024",
        author: "United Architects of the Philippines",
        year: "2024",
        description: "Official practice guidelines for architectural professionals",
        type: "Professional Guide",
        size: "3.1 MB",
        downloadUrl: "https://united-architects.org.ph/docs/UAP-Guidelines-2024.pdf"
      }
    ]
  },
  {
    institution: "Open Access Resources",
    resources: [
      {
        title: "Building Design and Construction Handbook",
        author: "Frederick S. Merritt",
        year: "2016",
        description: "Comprehensive handbook covering architectural and engineering principles",
        type: "Textbook",
        size: "45.2 MB",
        downloadUrl: "https://archive.org/download/building-design-handbook/BDC_Handbook_6th_Edition.pdf"
      },
      {
        title: "Sustainable Building Design Guidelines",
        author: "MIT OpenCourseWare",
        year: "2022",
        description: "Guide to sustainable architectural practices and green building design",
        type: "Course Material",
        size: "28.4 MB",
        downloadUrl: "https://ocw.mit.edu/courses/4-401-environmental-technologies-in-buildings-fall-2018/resources/sustainable_design.pdf"
      },
      {
        title: "Architectural Drawing Course",
        author: "Open Learn",
        year: "2023",
        description: "Tools and techniques for architectural drawing and visualization",
        type: "Educational Material",
        size: "32.1 MB",
        downloadUrl: "https://www.open.edu/openlearn/science-maths-technology/engineering-technology/architectural-drawing/content-section-0"
      }
    ]
  },
  {
    institution: "Reference Materials",
    resources: [
      {
        title: "Architectural Standards - Ernst Neufert",
        author: "Ernst Neufert",
        year: "2019",
        description: "Basic reference for architectural design standards and measurements",
        type: "Reference",
        size: "38.6 MB",
        downloadUrl: "https://archive.org/download/architects-data-neufert/Neufert-Architects_Data_5th_Edition.pdf"
      },
      {
        title: "Universal Design Guidelines",
        author: "Center for Universal Design",
        year: "2023",
        description: "Principles and guidelines for accessible architectural design",
        type: "Guidelines",
        size: "15.8 MB",
        downloadUrl: "https://projects.ncsu.edu/ncsu/design/cud/pubs_p/docs/UDPG.pdf"
      },
      {
        title: "Construction Materials Manual",
        author: "European Standards Committee",
        year: "2024",
        description: "Comprehensive guide to construction materials and their applications",
        type: "Technical Manual",
        size: "42.3 MB",
        downloadUrl: "https://www.constructionstandards.eu/downloads/materials-manual-2024.pdf"
      }
    ]
  }
];

const subjects = [
  {
    title: "Architectural Design",
    icon: Building2,
    description: "Fundamental principles and processes of architectural design",
    chapters: [
      {
        title: "Design Principles",
        content: `Drawing from Francis D.K. Ching's seminal work and Philippine architectural context, this chapter explores the fundamental elements that govern architectural design. We examine how form, space, and order interact to create meaningful architecture, with special emphasis on tropical design considerations and local cultural contexts.`,
        keyPoints: [
          "Form follows function in Philippine contemporary architecture",
          "Integration of indoor-outdoor spaces in tropical design",
          "Cultural symbolism in architectural forms",
          "Climate-responsive spatial organization",
          "Scale and proportion in Philippine architecture"
        ]
      },
      {
        title: "Design Process",
        content: `Based on contemporary Philippine architectural practice and theoretical frameworks, this chapter outlines the systematic approach to architectural design. From initial concept to final documentation, we explore the critical stages that transform ideas into buildable structures while considering local building regulations and cultural contexts.`,
        keyPoints: [
          "Site analysis and tropical climate considerations",
          "Client needs assessment in Philippine context",
          "Local material integration and sustainability",
          "Cultural and environmental impact studies",
          "Building code compliance and documentation"
        ]
      }
    ]
  },
  {
    title: "History of Architecture",
    icon: History,
    description: "Evolution of Philippine and global architectural styles",
    chapters: [
      {
        title: "Philippine Architecture",
        content: "Comprehensive study of Philippine architectural development from pre-colonial to contemporary periods",
        keyPoints: [
          "Pre-colonial Filipino architecture",
          "Spanish colonial influences",
          "American period developments",
          "Post-war modernization",
          "Contemporary Filipino architecture"
        ]
      },
      {
        title: "Asian Architectural Heritage",
        content: "Study of architectural traditions across Asia and their influence on Philippine design",
        keyPoints: [
          "Southeast Asian vernacular architecture",
          "Chinese architectural influences",
          "Islamic architectural elements",
          "Japanese design principles",
          "Modern Asian architecture"
        ]
      }
    ]
  },
  {
    title: "Environmental Design",
    icon: Trees,
    description: "Sustainable architecture and environmental systems in tropical contexts",
    chapters: [
      {
        title: "Tropical Design Strategies",
        content: `Based on Philippine climate conditions and environmental design principles, this chapter explores how buildings can respond to and work with tropical environments while maintaining comfort and efficiency.`,
        keyPoints: [
          "Natural ventilation in tropical climates",
          "Solar shading techniques",
          "Rainwater management systems",
          "Passive cooling strategies",
          "Local material applications"
        ]
      },
      {
        title: "Sustainable Systems",
        content: `Drawing from Philippine Green Building Code and local sustainable practices, this chapter examines material selection and system integration for environmental performance in tropical contexts.`,
        keyPoints: [
          "Philippine green building standards",
          "Local sustainable materials",
          "Energy efficiency in tropical climates",
          "Water conservation methods",
          "Waste management systems"
        ]
      }
    ]
  },
  {
    title: "Construction Technology",
    icon: Ruler,
    description: "Understanding building materials, methods, and systems",
    chapters: [
      {
        title: "Building Materials",
        content: `Referenced from Ching's 'Building Construction Illustrated', this chapter provides a comprehensive understanding of construction materials, their properties, and applications. We explore traditional and innovative materials that shape contemporary architecture, with a focus on materials commonly used in the Philippines.`,
        keyPoints: [
          "Concrete systems - cast-in-place, precast, reinforcement methods",
          "Steel construction - structural systems and connection details",
          "Bamboo and other local materials - sustainable timber solutions",
          "Indigenous building techniques",
          "Modern building materials for tropical climates"
        ]
      },
      {
        title: "Construction Methods",
        content: `Based on current industry practices and construction management principles in the Philippines, this chapter examines various construction techniques and their impact on architectural design decisions.`,
        keyPoints: [
          "Foundation systems - deep and shallow foundations",
          "Structural frameworks - load paths and force distribution",
          "Building envelope design - weatherproofing and thermal performance",
          "Construction sequencing - critical path planning",
          "Quality control methods - testing and inspection protocols"
        ]
      },
      {
        title: "Advanced Building Technologies",
        content: `Drawing from contemporary research and practice, this chapter explores cutting-edge construction technologies and their integration into architectural design.  We also consider the applicability of these technologies within the context of Philippine construction practices.`,
        keyPoints: [
          "Digital fabrication - 3D printing and robotic construction",
          "Prefabrication systems - modular and component-based construction",
          "Smart building technologies - IoT integration",
          "High-performance building systems - energy optimization",
          "Construction automation - emerging tools and methods"
        ]
      }
    ]
  },
  {
    title: "Urban Planning",
    icon: Building,
    description: "Principles of city planning and urban design",
    chapters: [
      {
        title: "Urban Design Principles",
        content: "Understanding the elements of successful urban spaces, with a focus on the unique challenges and opportunities of Philippine urban environments.",
        keyPoints: [
          "Street patterns and urban form",
          "Public spaces and community design",
          "Mixed-use development and urban density",
          "Sustainable transportation systems"
        ]
      },
      {
        title: "Sustainable Cities",
        content: "Planning for environmental and social sustainability in Philippine cities, considering the impact of climate change and rapid urbanization.",
        keyPoints: [
          "Green infrastructure and urban ecology",
          "Climate change adaptation and mitigation",
          "Resilient urban planning",
          "Community participation in urban development"
        ]
      },
    ]
  },
  {
    title: "Building Systems",
    icon: Lightbulb,
    description: "Mechanical, electrical, and plumbing systems",
    chapters: [
      {
        title: "HVAC Systems",
        content: "Understanding heating, ventilation, and air conditioning systems adapted for tropical climates.",
        keyPoints: [
          "System types for tropical climates",
          "Load calculations for efficient design",
          "Energy efficiency measures",
          "Control systems for optimal performance"
        ]
      },
      {
        title: "Electrical Systems",
        content: "Building electrical systems and lighting design considerations for Philippine contexts.",
        keyPoints: [
          "Power distribution planning",
          "Energy-efficient lighting solutions",
          "Emergency systems and safety standards",
          "Integration of smart building technology"
        ]
      },
    ]
  },
  {
    title: "Professional Practice",
    icon: Briefcase,
    description: "Business aspects of architectural practice",
    chapters: [
      {
        title: "Project Management",
        content: "Managing architectural projects from start to finish within the Philippine professional context.",
        keyPoints: [
          "Project planning and scheduling",
          "Team coordination and communication",
          "Budget management and cost control",
          "Quality control and risk management"
        ]
      },
      {
        title: "Legal Aspects",
        content: "Understanding contracts, regulations, and professional liability in Philippine architectural practice.",
        keyPoints: [
          "Philippine building codes and standards",
          "Contract law and documentation",
          "Professional ethics and licensing",
          "Risk management and insurance"
        ]
      },
    ]
  },
  {
    title: "Digital Design Tools",
    icon: PenSquare,
    description: "Modern architectural design and visualization tools",
    chapters: [
      {
        title: "CAD Fundamentals",
        content: "Essential computer-aided design principles and practices...",
        keyPoints: [
          "2D drafting basics",
          "3D modeling concepts",
          "Documentation standards",
          "File management and collaboration"
        ]
      },
      {
        title: "BIM Technology",
        content: "Understanding Building Information Modeling and its applications...",
        keyPoints: [
          "BIM workflow",
          "Model coordination",
          "Data management",
          "Project collaboration"
        ]
      },
    ]
  },
  {
    title: "Site Planning",
    icon: Compass,
    description: "Principles of site analysis and development",
    chapters: [
      {
        title: "Site Analysis",
        content: "Methods and considerations for evaluating building sites, with a focus on the unique characteristics of Philippine sites.",
        keyPoints: [
          "Topography analysis and site grading",
          "Environmental factors and climate considerations",
          "Zoning regulations and building codes",
          "Access and circulation planning"
        ]
      },
      {
        title: "Landscape Integration",
        content: "Integrating architecture with landscape design in Philippine contexts.",
        keyPoints: [
          "Sustainable landscaping practices",
          "Hardscape design and materials",
          "Water management systems",
          "Selection of native plant species"
        ]
      },
    ]
  },
  {
    title: "Interior Architecture",
    icon: PaintBucket,
    description: "Principles of interior space planning and design",
    chapters: [
      {
        title: "Space Planning",
        content: "Understanding spatial organization and circulation in interior spaces.",
        keyPoints: [
          "Functional zoning and space allocation",
          "Traffic flow analysis and circulation",
          "Program requirements and user needs",
          "Spatial relationships and design considerations"
        ]
      },
      {
        title: "Materials and Finishes",
        content: "Selection and application of interior materials, considering the climate and culture of the Philippines.",
        keyPoints: [
          "Material properties and performance",
          "Durability factors and maintenance",
          "Aesthetic considerations and design trends",
          "Sustainability criteria and environmental impact"
        ]
      },
    ]
  }
];

export default function EBook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [studyNotesOpen, setStudyNotesOpen] = useState(false);
  const { toast } = useToast();

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.chapters.some(chapter =>
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredResources = academicResources.flatMap(institution =>
    institution.resources.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );


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
            placeholder="Search subjects, topics, or resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Academic Resources Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Resources
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
                                <span className="inline-block mr-4">Year: {resource.year}</span>
                                <span className="inline-block">Size: {resource.size}</span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-4"
                              onClick={() => handleDownload(resource)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
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
              {filteredSubjects.map((subject, index) => (
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => {
                              setSelectedChapter(chapter);
                              setStudyNotesOpen(true);
                            }}
                          >
                            Study Notes
                          </Button>
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

      {selectedChapter && (
        <StudyNotes
          open={studyNotesOpen}
          onOpenChange={setStudyNotesOpen}
          chapter={selectedChapter}
        />
      )}

      <BackButton />
    </div>
  );
}