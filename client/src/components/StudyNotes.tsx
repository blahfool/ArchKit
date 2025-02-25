import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAs } from 'file-saver';

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

  const getChapterContent = () => {
    // Based on the chapter title, return specific study content
    switch (chapter.title.toLowerCase()) {
      case "design principles":
        return [
          {
            title: "Core Design Principles in Architecture",
            content: `
Understanding Architectural Design Principles
------------------------------------------

1. Form and Function
   • Analysis of how form emerges from functional requirements
   • Integration of cultural and environmental contexts
   • Balance between aesthetic appeal and practical utility
   • Case studies of successful form-function relationships in Philippine architecture

2. Space and Order
   • Principles of spatial organization in tropical architecture
   • Hierarchy and sequence in architectural spaces
   • Indoor-outdoor relationships in Philippine context
   • Climate-responsive spatial planning strategies

3. Scale and Proportion
   • Human scale in architectural design
   • Traditional Filipino proportioning systems
   • Modern interpretations of classical proportions
   • Anthropometric considerations in tropical climates

4. Context and Site Integration
   • Site analysis methodologies
   • Environmental and cultural context considerations
   • Local climate adaptation strategies
   • Sustainable site development approaches

5. Architectural Elements
   • Traditional Filipino architectural elements
   • Contemporary interpretations of vernacular features
   • Climate-responsive building components
   • Integration of modern and traditional elements
            `
          },
          {
            title: "Application in Philippine Context",
            content: `
Practical Applications in Local Architecture
-----------------------------------------

1. Regional Adaptations
   • Northern Luzon highland architecture
   • Coastal design considerations
   • Urban context adaptations
   • Rural architectural responses

2. Climate Response Strategies
   • Natural ventilation systems
   • Solar shading techniques
   • Rainfall management
   • Thermal comfort solutions

3. Material Applications
   • Indigenous building materials
   • Modern material innovations
   • Sustainable material choices
   • Local material availability and usage

4. Cultural Integration
   • Community patterns and spatial arrangements
   • Social spaces in Filipino architecture
   • Cultural symbolism in design
   • Contemporary cultural expressions

5. Professional Implementation
   • Design documentation requirements
   • Building code compliance
   • Sustainable certification processes
   • Project execution strategies
            `
          },
          {
            title: "Case Studies and Analysis",
            content: `
Philippine Architectural Case Studies
----------------------------------

1. Traditional Architecture
   • Bahay Kubo analysis
   • Bahay na Bato features
   • Indigenous structural systems
   • Vernacular space planning

2. Contemporary Projects
   • Modern tropical houses
   • Mixed-use developments
   • Institutional buildings
   • Cultural facilities

3. Sustainable Developments
   • Green building examples
   • Energy-efficient designs
   • Water conservation strategies
   • Waste management integration

4. Urban Interventions
   • City context solutions
   • Public space design
   • Transportation integration
   • Community development

5. Future Directions
   • Emerging design trends
   • Technology integration
   • Climate change adaptation
   • Resilient architecture strategies
            `
          }
        ];

      case "construction methods":
        return [
          {
            title: "Construction Technology Fundamentals",
            content: `
Building Systems and Methods
--------------------------

1. Foundation Systems
   • Soil conditions in Philippine context
   • Deep foundation applications
   • Shallow foundation techniques
   • Seismic considerations

2. Structural Systems
   • Concrete frame construction
   • Steel structure applications
   • Timber frame systems
   • Hybrid structural solutions

3. Wall Systems
   • Load-bearing walls
   • Curtain wall applications
   • Partition systems
   • Thermal and acoustic considerations

4. Roofing Technology
   • Traditional roofing systems
   • Modern roofing materials
   • Weather protection strategies
   • Ventilation integration

5. Building Envelope
   • Weather barrier systems
   • Insulation methods
   • Moisture control
   • Energy efficiency measures
            `
          },
          {
            title: "Construction Management",
            content: `
Project Execution and Control
---------------------------

1. Planning and Scheduling
   • Construction sequencing
   • Resource allocation
   • Timeline management
   • Quality control procedures

2. Site Management
   • Layout and organization
   • Safety protocols
   • Material handling
   • Equipment utilization

3. Quality Assurance
   • Inspection methods
   • Testing procedures
   • Documentation requirements
   • Compliance verification

4. Cost Control
   • Budget management
   • Cost tracking
   • Value engineering
   • Change order management

5. Project Documentation
   • Construction drawings
   • Specifications writing
   • Progress reporting
   • As-built documentation
            `
          },
          {
            title: "Modern Construction Technologies",
            content: `
Advanced Building Technologies
---------------------------

1. Digital Construction
   • BIM implementation
   • Digital fabrication
   • 3D printing applications
   • Automated systems

2. Sustainable Construction
   • Green building methods
   • Waste reduction strategies
   • Recycled materials
   • Energy-efficient systems

3. Prefabrication
   • Modular construction
   • Component systems
   • Assembly methods
   • Quality control

4. Smart Building Integration
   • Building automation
   • Security systems
   • Energy management
   • Maintenance monitoring

5. Future Trends
   • Emerging technologies
   • Innovation integration
   • Industry developments
   • Research directions
            `
          }
        ];

      // Add more cases for other chapters...

      default:
        return [
          {
            title: "Overview",
            content: chapter.content,
            keyPoints: chapter.keyPoints || []
          }
        ];
    }
  };

  const pages = getChapterContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-2 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>{chapter.title} - Study Notes</span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => {
                  const content = pages.map(page => 
                    `${page.title}\n${page.content}`
                  ).join('\n\n');
                  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                  saveAs(blob, `${chapter.title.toLowerCase().replace(/\s+/g, '_')}_notes.txt`);
                }}
              >
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