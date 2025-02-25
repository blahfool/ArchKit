import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudyNotesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: {
    title: string;
    content: string;
    keyPoints?: string[];
  };
}

export default function StudyNotes({ open, onOpenChange, chapter }: StudyNotesProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Generate detailed content for each page
  const pages = [
    {
      title: "Introduction",
      content: `
${chapter.content}

Detailed Overview:
This section provides a comprehensive introduction to ${chapter.title.toLowerCase()}. We'll explore 
the fundamental concepts, historical context, and modern applications of these principles in 
contemporary architecture.

${chapter.keyPoints ? `
Key Learning Objectives:
${chapter.keyPoints.map((point, index) => `${index + 1}. ${point}
   • Detailed understanding of ${point.toLowerCase()}
   • Practical applications in modern architecture
   • Case studies and historical examples`).join('\n\n')}` : ''}
      `,
    },
    {
      title: "Core Concepts",
      content: `
Understanding ${chapter.title}

Theoretical Framework:
1. Historical Development
   • Origins and evolution
   • Key influential figures
   • Major paradigm shifts

2. Modern Applications
   • Contemporary interpretations
   • Technological integration
   • Sustainable approaches

3. Design Principles
   • Spatial relationships
   • Form and function
   • Material considerations
   • Environmental impact

4. Implementation Strategies
   • Planning and preparation
   • Execution methodology
   • Quality control measures
   • Performance evaluation
      `,
    },
    {
      title: "Case Studies",
      content: `
Real-World Applications of ${chapter.title}

Example Projects:

1. Modern Implementation
   • Project: Contemporary Urban Development
   • Location: Various global cities
   • Key Features: Integration of modern technology with traditional principles
   • Outcome: Successful blend of form and function

2. Historical Analysis
   • Project: Classical Architectural Examples
   • Period: Various historical eras
   • Key Features: Traditional methods and materials
   • Lessons Learned: Timeless principles and adaptations

3. Future Directions
   • Emerging trends
   • Technological innovations
   • Sustainable practices
   • Integration with smart systems
      `,
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-2 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>{chapter.title} - Study Notes</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-8 max-w-3xl mx-auto space-y-8">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h2 className="text-2xl font-semibold mb-4">
                  {pages[currentPage - 1].title}
                </h2>

                <div className="whitespace-pre-wrap font-serif leading-relaxed">
                  {pages[currentPage - 1].content}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="border-t p-4 flex items-center justify-between bg-background">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {pages.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
              disabled={currentPage === pages.length}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}