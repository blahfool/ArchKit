import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  Calculator as CalcIcon,
  MessageSquare,
  Clock,
  Users,
  FileSpreadsheet,
  CheckSquare
} from "lucide-react";

export default function ProfessionalTools() {
  return (
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Professional Practice Tools</h1>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Project Management */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Project Management
                    </h2>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="h-4 w-4 mr-2" />
                        Timeline Generator
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        Team Coordination
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Task Tracking
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Templates */}
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Document Templates
                    </h2>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Contract Templates
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Specifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Client Forms
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Estimation */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CalcIcon className="h-5 w-5" />
                    Cost Estimation Tools
                  </h2>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <CalcIcon className="h-4 w-4 mr-2" />
                      Project Cost Calculator
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Material Cost Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Fee Proposal Generator
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Resources */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">Professional Resources</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto py-4 px-6">
                      <FileText className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Practice Guidelines</div>
                        <div className="text-sm text-muted-foreground">Standard procedures</div>
                      </div>
                    </Button>

                    <Button variant="outline" className="h-auto py-4 px-6">
                      <Users className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Client Relations</div>
                        <div className="text-sm text-muted-foreground">Communication guides</div>
                      </div>
                    </Button>

                    <Button variant="outline" className="h-auto py-4 px-6">
                      <CalcIcon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Financial Tools</div>
                        <div className="text-sm text-muted-foreground">Budgeting resources</div>
                      </div>
                    </Button>

                    <Button variant="outline" className="h-auto py-4 px-6">
                      <CheckSquare className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Quality Control</div>
                        <div className="text-sm text-muted-foreground">Review checklists</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <BackButton />
    </div>
  );
}
