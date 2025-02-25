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
    studyNotes?: string[];
  };
}

export default function StudyNotes({ open, onOpenChange, chapter }: StudyNotesProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock content for demonstration
  const pages = [
    {
      title: "Introduction",
      content: chapter.content,
      keyPoints: chapter.keyPoints,
    },
    {
      title: "Detailed Notes",
      content: `
        Here we dive deeper into ${chapter.title}. The principles and practices
        outlined in this chapter form the foundation of architectural understanding.
        Students should pay special attention to the relationships between different
        concepts and their practical applications.
        
        Key Considerations:
        • Understanding the historical context
        • Modern applications and innovations
        • Integration with other architectural elements
        • Practical implementation guidelines
      `,
    },
    {
      title: "Case Studies",
      content: `
        Let's examine real-world examples that demonstrate the principles of
        ${chapter.title} in action. These case studies provide valuable insights
        into how theoretical concepts are applied in practice.
        
        Example Projects:
        1. Contemporary implementations
        2. Historical significance
        3. Innovation in design
        4. Sustainability considerations
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
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
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
                
                <div className="whitespace-pre-wrap">
                  {pages[currentPage - 1].content}
                </div>

                {currentPage === 1 && pages[currentPage - 1].keyPoints && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Key Points:</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {pages[currentPage - 1].keyPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="border-t p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {pages.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(pages.length, prev + 1))}
              disabled={currentPage === pages.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
