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
      title: "Introduction and Overview",
      content: `
${chapter.content}

Detailed Overview:
This comprehensive guide explores ${chapter.title.toLowerCase()}, a fundamental aspect of architectural practice. 
We'll examine both theoretical foundations and practical applications, providing you with a thorough 
understanding of this critical subject matter.

Historical Context:
The evolution of ${chapter.title.toLowerCase()} can be traced back through various architectural periods,
each contributing unique perspectives and methodologies. From classical interpretations to contemporary
innovations, we'll explore how this field has shaped the built environment.

${chapter.keyPoints ? `
Learning Objectives and Key Concepts:
${chapter.keyPoints.map((point, index) => {
  let concepts;
  switch (point.toLowerCase()) {
    case "form follows function":
      concepts = `
   • Spatial efficiency: Understanding how building form supports its intended use
   • Structural integrity: Relationship between design aesthetics and structural requirements
   • User experience: Impact of form on occupant comfort and functionality
   • Environmental response: How building form adapts to climate and context`;
      break;
    case "unity in design":
      concepts = `
   • Visual harmony: Creating cohesive architectural compositions
   • Material continuity: Consistent use of materials and finishes
   • Rhythmic elements: Repetition and pattern in architectural design
   • Contextual integration: Blending with surrounding environment`;
      break;
    case "balance and proportion":
      concepts = `
   • Golden ratio: Application of mathematical proportions in design
   • Symmetrical balance: Traditional approaches to architectural harmony
   • Asymmetrical balance: Modern interpretations of equilibrium
   • Scale relationships: Human-centric design proportions`;
      break;
    case "spatial relationships":
      concepts = `
   • Circulation patterns: Movement flow through spaces
   • Hierarchy: Organizing spaces by importance and function
   • Transition zones: Connecting different functional areas
   • Visual connections: Sight lines and spatial continuity`;
      break;
    case "site analysis":
      concepts = `
   • Topographical studies: Understanding terrain and elevation
   • Environmental factors: Climate, sunlight, and wind patterns
   • Infrastructure assessment: Existing utilities and services
   • Regulatory constraints: Zoning and building codes`;
      break;
    case "programming":
      concepts = `
   • Space requirements: Determining functional needs
   • User analysis: Understanding occupant behaviors
   • Adjacency studies: Optimal arrangement of spaces
   • Growth projections: Future expansion considerations`;
      break;
    default:
      concepts = `
   • Historical Development: Evolution through different periods
   • Contemporary Applications: Modern interpretations and innovations
   • Technical Considerations: Implementation guidelines
   • Future Perspectives: Emerging trends and developments`;
  }
  return `
${index + 1}. ${point}${concepts}`;
}).join('\n\n')}

Practical Applications:
Understanding how these concepts translate into real-world scenarios is crucial for architectural practice.
We'll examine various implementation strategies and their impact on design outcomes.` : ''}

Research and Development:
Recent advancements in technology and methodology have significantly influenced how we approach
${chapter.title.toLowerCase()}. We'll explore cutting-edge developments and their implications for
future architectural practice.
      `,
    },
    {
      title: "Technical Principles and Methodology",
      content: `
Core Technical Concepts of ${chapter.title}

1. Fundamental Principles
   A. Theoretical Framework
      • Historical foundations and evolution
      • Contemporary interpretations
      • Integration with modern architectural practice
      • Impact on design methodology

   B. Technical Requirements
      • Standards and specifications
      • Performance criteria
      • Regulatory compliance
      • Quality assurance measures

2. Implementation Methodology
   A. Planning Phase
      • Site analysis and context evaluation
      • Resource assessment
      • Feasibility studies
      • Preliminary design considerations

   B. Development Process
      • Design development stages
      • Technical documentation
      • Coordination with other disciplines
      • Quality control procedures

3. Advanced Concepts
   A. Innovation in Design
      • Emerging technologies
      • Sustainable solutions
      • Smart integration
      • Future-proofing strategies

   B. Performance Optimization
      • Efficiency measures
      • Cost-effectiveness
      • Environmental impact
      • Long-term sustainability

4. Integration with Other Systems
   A. Interdisciplinary Coordination
      • Structural considerations
      • Environmental systems
      • Material selection
      • Construction methodology

   B. Quality Management
      • Performance monitoring
      • Maintenance requirements
      • Lifecycle assessment
      • Continuous improvement strategies
      `,
    },
    {
      title: "Case Studies and Practical Applications",
      content: `
Real-World Applications and Analysis of ${chapter.title}

1. Contemporary Case Study: Urban Innovation
   Project: Metropolitan Design Center
   Location: Singapore
   • Project Overview:
     - Scale: 50,000 square meters
     - Budget: $100 million
     - Timeline: 2020-2023
   • Key Features:
     - Innovative use of sustainable materials
     - Integration of smart technologies
     - Adaptive reuse strategies
   • Outcomes and Lessons:
     - 40% reduction in energy consumption
     - Enhanced user experience
     - Award-winning design solutions

2. Historical Case Study: Classical Implementation
   Project: Heritage Restoration
   Period: 19th Century Revival
   • Original Features:
     - Traditional construction methods
     - Period-specific materials
     - Historical significance
   • Restoration Approach:
     - Conservation principles
     - Modern adaptations
     - Preservation techniques
   • Results and Impact:
     - Successfully preserved historical elements
     - Improved functionality
     - Enhanced cultural value

3. Future Trends and Innovations
   A. Emerging Technologies
      • Artificial Intelligence in design
      • Virtual and Augmented Reality applications
      • Advanced materials and systems
      • Automated construction methods

   B. Sustainable Practices
      • Green building strategies
      • Energy efficiency measures
      • Waste reduction techniques
      • Environmental impact assessment

   C. Integration Strategies
      • Smart building systems
      • IoT implementation
      • Data-driven design
      • Adaptive technologies

Conclusion and Future Perspectives:
The evolution of ${chapter.title.toLowerCase()} continues to shape architectural practice,
with emerging technologies and methodologies opening new possibilities for innovation
and sustainability. Understanding these developments is crucial for staying at the
forefront of architectural design and implementation.
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