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
  Search
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import StudyNotes from "@/components/StudyNotes";

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

const subjects: Subject[] = [
  {
    title: "Architectural Design",
    icon: Building2,
    description: "Fundamental principles and processes of architectural design",
    chapters: [
      {
        title: "Design Principles",
        content: `Drawing from Francis D.K. Ching's seminal work, this chapter explores the fundamental elements that govern architectural design. We examine how form, space, and order interact to create meaningful architecture. Understanding these principles is crucial for developing a strong foundation in architectural design.`,
        keyPoints: [
          "Form follows function - Sullivan's principle and its modern interpretations",
          "Unity through organizational principles - hierarchy, datum, rhythm",
          "Balance in architectural composition - symmetrical and asymmetrical arrangements",
          "Spatial relationships - nested, interlocked, and adjacent spaces",
          "Scale and proportion - human scale, golden section, Le Corbusier's Modulor"
        ]
      },
      {
        title: "Design Process",
        content: `Based on contemporary architectural practice and theoretical frameworks, this chapter outlines the systematic approach to architectural design. From initial concept to final documentation, we explore the critical stages that transform ideas into buildable structures.`,
        keyPoints: [
          "Pre-design and programming - client needs analysis and site evaluation",
          "Conceptual design - form generation and spatial organization",
          "Schematic design - preliminary plans and elevations",
          "Design development - material selection and system integration",
          "Construction documentation - technical drawings and specifications"
        ]
      },
      {
        title: "Theory and Criticism",
        content: `Exploring architectural theory through the lens of critical thinkers like Kenneth Frampton and Robert Venturi, this chapter examines the intellectual foundations of architectural design and their impact on contemporary practice.`,
        keyPoints: [
          "Critical regionalism - cultural context and local identity",
          "Phenomenology in architecture - experiential design",
          "Sustainability theories - ecological design principles",
          "Post-modernism and deconstructivism - challenging modernist dogma",
          "Contemporary theoretical frameworks - digital age architecture"
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
        content: `Referenced from Ching's 'Building Construction Illustrated', this chapter provides a comprehensive understanding of construction materials, their properties, and applications. We explore traditional and innovative materials that shape contemporary architecture.`,
        keyPoints: [
          "Concrete systems - cast-in-place, precast, reinforcement methods",
          "Steel construction - structural systems and connection details",
          "Wood and engineered wood products - sustainable timber solutions",
          "Glass and glazing systems - performance and aesthetics",
          "Emerging materials - composites, smart materials, nanomaterials"
        ]
      },
      {
        title: "Construction Methods",
        content: `Based on current industry practices and construction management principles, this chapter examines various construction techniques and their impact on architectural design decisions.`,
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
        content: `Drawing from contemporary research and practice, this chapter explores cutting-edge construction technologies and their integration into architectural design.`,
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
    title: "History of Architecture",
    icon: History,
    description: "Evolution of architectural styles through the ages",
    chapters: [
      {
        title: "Classical Architecture",
        content: "Greek and Roman architectural principles and their influence...",
        keyPoints: [
          "Classical orders",
          "Temple architecture",
          "Roman engineering",
          "Classical revival"
        ]
      },
      {
        title: "Modern Movement",
        content: "Development of modern architecture in the 20th century...",
        keyPoints: [
          "International Style",
          "Bauhaus movement",
          "Modernist pioneers",
          "Post-modernism"
        ]
      },
    ]
  },
  {
    title: "Urban Planning",
    icon: Building,
    description: "Principles of city planning and urban design",
    chapters: [
      {
        title: "Urban Design Principles",
        content: "Understanding the elements of successful urban spaces...",
        keyPoints: [
          "Street patterns",
          "Public spaces",
          "Mixed-use development",
          "Transportation systems"
        ]
      },
      {
        title: "Sustainable Cities",
        content: "Planning for environmental and social sustainability...",
        keyPoints: [
          "Green infrastructure",
          "Smart cities",
          "Community planning",
          "Urban ecology"
        ]
      },
    ]
  },
  {
    title: "Environmental Design",
    icon: Trees,
    description: "Principles of sustainable architecture and environmental systems",
    chapters: [
      {
        title: "Climate Responsive Design",
        content: `Based on environmental design principles from leading practitioners, this chapter explores how buildings can respond to and work with their climate context.`,
        keyPoints: [
          "Passive solar design strategies",
          "Natural ventilation systems",
          "Thermal mass utilization",
          "Microclimate modification",
          "Building orientation and form optimization"
        ]
      },
      {
        title: "Sustainable Materials and Systems",
        content: `Drawing from LEED guidelines and sustainable building practices, this chapter examines material selection and system integration for environmental performance.`,
        keyPoints: [
          "Life cycle assessment methods",
          "Renewable material sources",
          "Energy efficient systems",
          "Water conservation strategies",
          "Waste reduction techniques"
        ]
      }
    ]
  },
  {
    title: "Building Systems",
    icon: Lightbulb,
    description: "Mechanical, electrical, and plumbing systems",
    chapters: [
      {
        title: "HVAC Systems",
        content: "Understanding heating, ventilation, and air conditioning...",
        keyPoints: [
          "System types",
          "Load calculations",
          "Energy efficiency",
          "Control systems"
        ]
      },
      {
        title: "Electrical Systems",
        content: "Building electrical systems and lighting design...",
        keyPoints: [
          "Power distribution",
          "Lighting design",
          "Emergency systems",
          "Smart building technology"
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
        content: "Managing architectural projects from start to finish...",
        keyPoints: [
          "Project planning",
          "Team coordination",
          "Budget management",
          "Quality control"
        ]
      },
      {
        title: "Legal Aspects",
        content: "Understanding contracts, regulations, and professional liability...",
        keyPoints: [
          "Building codes",
          "Contract documents",
          "Professional ethics",
          "Risk management"
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
        content: "Methods and considerations for evaluating building sites...",
        keyPoints: [
          "Topography analysis",
          "Environmental factors",
          "Zoning regulations",
          "Access and circulation"
        ]
      },
      {
        title: "Landscape Integration",
        content: "Integrating architecture with landscape design...",
        keyPoints: [
          "Sustainable landscaping",
          "Hardscape design",
          "Water management",
          "Native species selection"
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
        content: "Understanding spatial organization and circulation...",
        keyPoints: [
          "Functional zoning",
          "Traffic flow analysis",
          "Program requirements",
          "Spatial relationships"
        ]
      },
      {
        title: "Materials and Finishes",
        content: "Selection and application of interior materials...",
        keyPoints: [
          "Material properties",
          "Durability factors",
          "Aesthetic considerations",
          "Sustainability criteria"
        ]
      },
    ]
  }
];

export default function EBook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [studyNotesOpen, setStudyNotesOpen] = useState(false);

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.chapters.some(chapter =>
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.content.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search subjects or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <CardContent className="p-6">
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