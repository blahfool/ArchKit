import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Book, 
  CheckSquare, 
  Globe,
  ArrowRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BuildingCodes() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Building Code Navigator</h1>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-9"
                placeholder="Search building codes, regulations, or standards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Button variant="outline" className="h-auto py-4 px-6">
                <Book className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Code Library</div>
                  <div className="text-sm text-muted-foreground">Browse all codes</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6">
                <CheckSquare className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Compliance Check</div>
                  <div className="text-sm text-muted-foreground">Verify requirements</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6">
                <Globe className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Regional Guides</div>
                  <div className="text-sm text-muted-foreground">Local regulations</div>
                </div>
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Building Planning and Design</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Occupancy Classification
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Means of Egress
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Accessibility Requirements
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Structural Provisions</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Structural Design Requirements
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Foundation Systems
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Seismic Design Criteria
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Fire Safety</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Fire-Resistance Requirements
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Fire Protection Systems
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Emergency Systems
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <BackButton />
    </div>
  );
}
