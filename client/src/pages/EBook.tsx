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
        content: "Learn about form, function, space, and order in architectural design...",
        keyPoints: [
          "Form follows function",
          "Unity in design",
          "Balance and proportion",
          "Spatial relationships"
        ]
      },
      {
        title: "Design Process",
        content: "Understanding the stages of architectural design from concept to completion...",
        keyPoints: [
          "Site analysis",
          "Programming",
          "Schematic design",
          "Design development",
          "Construction documents"
        ]
      },
    ]
  },
  {
    title: "Construction Technology",
    icon: Ruler,
    description: "Understanding building materials, methods, and systems",
    chapters: [
      {
        title: "Building Materials",
        content: "Comprehensive guide to construction materials and their applications...",
        keyPoints: [
          "Concrete and masonry",
          "Steel and metals",
          "Wood and timber",
          "Glass and glazing"
        ]
      },
      {
        title: "Construction Methods",
        content: "Modern and traditional construction techniques explained...",
        keyPoints: [
          "Foundation systems",
          "Structural systems",
          "Building envelope",
          "Construction sequencing"
        ]
      },
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
    title: "Sustainable Design",
    icon: Trees,
    description: "Environmental strategies and green building practices",
    chapters: [
      {
        title: "Sustainable Principles",
        content: "Core concepts of sustainable architecture and design...",
        keyPoints: [
          "Energy efficiency",
          "Water conservation",
          "Material selection",
          "Indoor air quality"
        ]
      },
      {
        title: "Green Building Systems",
        content: "Integration of sustainable systems in buildings...",
        keyPoints: [
          "Solar design",
          "Natural ventilation",
          "Renewable energy",
          "Waste management"
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
];

export default function EBook() {
  const [searchTerm, setSearchTerm] = useState("");

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

      <BackButton />
    </div>
  );
}