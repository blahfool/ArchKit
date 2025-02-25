import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Book, Search, Building2, Compass, PenSquare, Trees, Ruler, PaintBucket } from "lucide-react";
import BackButton from "@/components/BackButton";

interface Chapter {
  title: string;
  content: string;
}

interface Subject {
  title: string;
  icon: any;
  chapters: Chapter[];
}

export default function EBook() {
  const [searchTerm, setSearchTerm] = useState("");

  const subjects: Subject[] = [
    {
      title: "Architectural Design",
      icon: Building2,
      chapters: [
        {
          title: "Design Principles",
          content: "Learn about form, function, space, and order in architectural design..."
        },
        {
          title: "Design Process",
          content: "Understanding the stages of architectural design from concept to completion..."
        },
      ]
    },
    {
      title: "Technical Drawing",
      icon: PenSquare,
      chapters: [
        {
          title: "Orthographic Projection",
          content: "Master the fundamental principles of orthographic projection..."
        },
        {
          title: "Section and Elevation",
          content: "Learn to create detailed section views and elevations..."
        },
      ]
    },
    {
      title: "Construction Technology",
      icon: Ruler,
      chapters: [
        {
          title: "Building Materials",
          content: "Comprehensive guide to construction materials and their applications..."
        },
        {
          title: "Construction Methods",
          content: "Modern and traditional construction techniques explained..."
        },
      ]
    },
    {
      title: "Environmental Design",
      icon: Trees,
      chapters: [
        {
          title: "Sustainable Architecture",
          content: "Principles of sustainable design and green building practices..."
        },
        {
          title: "Climate Response",
          content: "Designing buildings that respond to local climate conditions..."
        },
      ]
    },
    {
      title: "Interior Design",
      icon: PaintBucket,
      chapters: [
        {
          title: "Space Planning",
          content: "Learn effective space planning and room layout techniques..."
        },
        {
          title: "Materials and Finishes",
          content: "Guide to selecting appropriate interior materials and finishes..."
        },
      ]
    },
  ];

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.chapters.some(chapter => 
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <Book className="h-8 w-8" />
          Architecture E-Book
        </h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-9"
            placeholder="Search subjects or chapters..."
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
                      <span>{subject.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {subject.chapters.map((chapter, chapterIndex) => (
                        <div key={chapterIndex} className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">{chapter.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {chapter.content}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                          >
                            Read More
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
