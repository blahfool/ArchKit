import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Calendar,
  Calculator as CalcIcon,
  MessageSquare,
  Clock,
  Users,
  FileSpreadsheet,
  CheckSquare,
  Plus,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveAs } from 'file-saver';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
}

interface TimelineEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  phase: string;
}

const generateContractTemplate = () => {
  const template = `
STANDARD ARCHITECTURAL SERVICES AGREEMENT

This Agreement is made on [DATE] between:

CLIENT:
[Client Name]
[Address]
[Contact Information]

ARCHITECT:
[Architect Name]
[PRC License Number]
[UAP Member Number]
[Address]
[Contact Information]

1. SCOPE OF SERVICES
   The Architect shall provide the following services:
   □ Schematic Design
   □ Design Development
   □ Construction Documents
   □ Bidding Assistance
   □ Construction Administration

2. PROJECT DESCRIPTION
   Project Name: 
   Location:
   Type of Project:
   Estimated Floor Area:
   Estimated Project Cost:

3. COMPENSATION
   Professional Fee: [Amount]
   Payment Schedule:
   • Schematic Design: 20%
   • Design Development: 30%
   • Construction Documents: 30%
   • Construction Administration: 20%

4. PROJECT TIMELINE
   Estimated Start Date:
   Estimated Completion Date:

5. TERMS AND CONDITIONS
   [Standard terms as per UAP guidelines]

Signatures:

_________________    _________________
Client              Architect
Date:              Date:
`;
  return new Blob([template], { type: 'text/plain;charset=utf-8' });
};

const generateClientFormTemplate = () => {
  const template = `
CLIENT REQUIREMENTS FORM

Project Information:
□ New Construction
□ Renovation
□ Interior Design
□ Other: __________

1. CLIENT DETAILS
   Name:
   Contact Number:
   Email:
   Address:

2. PROJECT REQUIREMENTS
   Intended Use:
   Estimated Budget:
   Desired Timeline:
   Special Requirements:

3. SPACE REQUIREMENTS
   Total Floor Area:
   Number of Rooms:
   Special Facilities:

4. DESIGN PREFERENCES
   Style Preference:
   □ Modern
   □ Traditional
   □ Contemporary
   □ Filipino
   □ Other: __________

5. SUSTAINABILITY GOALS
   □ BERDE Certification
   □ LEED Certification
   □ Energy Efficiency
   □ Other: __________

6. ADDITIONAL NOTES
   [Space for additional requirements]

Submitted by: _________________
Date: _________________
`;
  return new Blob([template], { type: 'text/plain;charset=utf-8' });
};

const generateSpecificationTemplate = () => {
  const template = `
ARCHITECTURAL SPECIFICATIONS

Project: [Project Name]
Location: [Project Location]
Architect: [Architect Name]
Date: [Date]

DIVISION 1 - GENERAL REQUIREMENTS

1.1 WORK INCLUDED
    A. Scope of Work
    B. Project Requirements
    C. Quality Assurance

1.2 SUBMITTALS
    A. Shop Drawings
    B. Product Data
    C. Samples

DIVISION 2 - SITE WORK

2.1 SITE PREPARATION
    A. Clearing and Grubbing
    B. Earthwork
    C. Grading

DIVISION 3 - CONCRETE

3.1 CAST-IN-PLACE CONCRETE
    A. Materials
    B. Mix Design
    C. Placement
    D. Finishing

[Continue with other divisions...]
`;
  return new Blob([template], { type: 'text/plain;charset=utf-8' });
};

export default function ProfessionalTools() {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    status: 'todo'
  });
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: '',
    startDate: '',
    endDate: '',
    phase: ''
  });

  const { toast } = useToast();

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || '',
      assignee: newTask.assignee || '',
      dueDate: newTask.dueDate!,
      status: newTask.status as 'todo'
    };

    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      dueDate: '',
      status: 'todo'
    });
    setIsTaskOpen(false);

    toast({
      title: "Task Added",
      description: "New task has been added to the project."
    });
  };

  const handleAddTimelineEvent = () => {
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const event: TimelineEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      startDate: newEvent.startDate!,
      endDate: newEvent.endDate!,
      phase: newEvent.phase || 'Planning'
    };

    setTimeline(prev => [...prev, event]);
    setNewEvent({
      title: '',
      startDate: '',
      endDate: '',
      phase: ''
    });
    setIsTimelineOpen(false);

    toast({
      title: "Timeline Updated",
      description: "New event has been added to the timeline."
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from the project."
    });
  };

  const handleDownload = (templateType: string) => {
    let blob: Blob;
    let filename: string;

    switch (templateType) {
      case 'contract':
        blob = generateContractTemplate();
        filename = 'architectural-services-agreement.txt';
        break;
      case 'specifications':
        blob = generateSpecificationTemplate();
        filename = 'architectural-specifications.txt';
        break;
      case 'client-form':
        blob = generateClientFormTemplate();
        filename = 'client-requirements-form.txt';
        break;
      default:
        toast({
          title: "Error",
          description: "Template not found",
          variant: "destructive"
        });
        return;
    }

    saveAs(blob, filename);
    toast({
      title: "Download Started",
      description: `${filename} is being downloaded to your device.`
    });
  };

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
                      <Dialog open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <Clock className="h-4 w-4 mr-2" />
                            Timeline Generator
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Timeline Event</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="event-title">Event Title*</Label>
                              <Input
                                id="event-title"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., Schematic Design Phase"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="start-date">Start Date*</Label>
                                <Input
                                  id="start-date"
                                  type="date"
                                  value={newEvent.startDate}
                                  onChange={(e) => setNewEvent(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                              </div>
                              <div>
                                <Label htmlFor="end-date">End Date*</Label>
                                <Input
                                  id="end-date"
                                  type="date"
                                  value={newEvent.endDate}
                                  onChange={(e) => setNewEvent(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="phase">Project Phase</Label>
                              <Input
                                id="phase"
                                value={newEvent.phase}
                                onChange={(e) => setNewEvent(prev => ({ ...prev, phase: e.target.value }))}
                                placeholder="e.g., Planning, Design, Construction"
                              />
                            </div>
                            <Button onClick={handleAddTimelineEvent} className="w-full">
                              Add to Timeline
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Task Tracking
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="task-title">Task Title*</Label>
                              <Input
                                id="task-title"
                                value={newTask.title}
                                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter task title"
                              />
                            </div>
                            <div>
                              <Label htmlFor="task-description">Description</Label>
                              <Textarea
                                id="task-description"
                                value={newTask.description}
                                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Task details"
                              />
                            </div>
                            <div>
                              <Label htmlFor="assignee">Assignee</Label>
                              <Input
                                id="assignee"
                                value={newTask.assignee}
                                onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                                placeholder="Team member name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="due-date">Due Date*</Label>
                              <Input
                                id="due-date"
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                              />
                            </div>
                            <Button onClick={handleAddTask} className="w-full">
                              Add Task
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Display Timeline */}
                    {timeline.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Project Timeline</h3>
                        <div className="space-y-2">
                          {timeline.map(event => (
                            <div key={event.id} className="text-sm p-2 bg-secondary rounded-lg">
                              <div className="font-medium">{event.title}</div>
                              <div className="text-muted-foreground">
                                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                              </div>
                              <div className="text-muted-foreground">{event.phase}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Display Tasks */}
                    {tasks.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Current Tasks</h3>
                        <div className="space-y-2">
                          {tasks.map(task => (
                            <div key={task.id} className="flex items-start justify-between p-2 bg-secondary rounded-lg">
                              <div className="text-sm">
                                <div className="font-medium">{task.title}</div>
                                <div className="text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                                {task.assignee && (
                                  <div className="text-muted-foreground">Assignee: {task.assignee}</div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task.id)}
                                className="h-6 w-6"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleDownload('contract')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Contract Templates
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleDownload('specifications')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Specifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => handleDownload('client-form')}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Client Forms
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Estimation Tools */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CalcIcon className="h-5 w-5" />
                    Cost Estimation Tools
                  </h2>
                  <div className="space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalcIcon className="h-4 w-4 mr-2" />
                          Project Cost Calculator
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Project Cost Calculator</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label>Project Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="residential">Residential</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="institutional">Institutional</SelectItem>
                                <SelectItem value="industrial">Industrial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Floor Area (sq m)</Label>
                            <Input type="number" placeholder="Enter floor area" />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="metro-manila">Metro Manila</SelectItem>
                                <SelectItem value="luzon">Other Luzon Areas</SelectItem>
                                <SelectItem value="visayas">Visayas</SelectItem>
                                <SelectItem value="mindanao">Mindanao</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Quality Grade</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select quality grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="luxury">Class AA (Luxury)</SelectItem>
                                <SelectItem value="high">Class A (High-End)</SelectItem>
                                <SelectItem value="medium">Class B (Mid-Range)</SelectItem>
                                <SelectItem value="standard">Class C (Standard)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full" onClick={() => {
                            toast({
                              title: "Cost Estimate Generated",
                              description: "Advanced cost calculation will be available in the next update."
                            });
                          }}>
                            Calculate Cost
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Material Cost Database
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Material Cost Database</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Input placeholder="Search materials..." />
                          <div className="border rounded-lg divide-y">
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Concrete (per cubic meter)</div>
                                <div className="text-sm text-muted-foreground">Ready-mix, 4000 PSI</div>
                              </div>
                              <div className="font-medium">₱3,500.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Reinforcing Steel (per kg)</div>
                                <div className="text-sm text-muted-foreground">Grade 40/60</div>
                              </div>
                              <div className="font-medium">₱65.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">CHB (per piece)</div>
                                <div className="text-sm text-muted-foreground">6" Concrete Hollow Block</div>
                              </div>
                              <div className="font-medium">₱25.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Portland Cement (per bag)</div>
                                <div className="text-sm text-muted-foreground">
                                  <div>• Holcim Excel: ₱285.00</div>
                                  <div>• Republic Cement: ₱280.00</div>
                                  <div>• Cemex APO: ₱278.00</div>
                                  <div>• Eagle Cement: ₱275.00</div>
                                  <div>Type 1, 40kg</div>
                                </div>
                              </div>
                              <div className="font-medium">₱275.00 - ₱285.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Reinforcing Steel (per kg)</div>
                                <div className="text-sm text-muted-foreground">
                                  <div>• SteelAsia Grade 60: ₱68.00</div>
                                  <div>• Pag-asa Steel Grade 40: ₱65.00</div>
                                  <div>• Metal Crown Grade 40: ₱64.00</div>
                                </div>
                              </div>
                              <div className="font-medium">₱64.00 - ₱68.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Plywood (per piece)</div>
                                <div className="text-sm text-muted-foreground">
                                  <div>• Santa Clara Marine: ₱1,250.00</div>
                                  <div>• Phoenix Marine: ₱1,200.00</div>
                                  <div>• Mindanao Marine: ₱1,150.00</div>
                                  <div>1/2" x 4' x 8'</div>
                                </div>
                              </div>
                              <div className="font-medium">₱1,150.00 - ₱1,250.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Metal Roofing (per meter)</div>
                                <div className="text-sm text-muted-foreground">
                                  <div>• DN Steel Gauge 26: ₱290.00</div>
                                  <div>• Puyat Steel Gauge 26: ₱285.00</div>
                                  <div>• Union Galvasteel: ₱280.00</div>
                                  <div>Corrugated GI</div>
                                </div>
                              </div>
                              <div className="font-medium">₱280.00 - ₱290.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Electrical Wire (per roll)</div>
                                <div className="text-sm text-muted-foreground">
                                  <div>• Phelps Dodge THHN: ₱4,200.00</div>
                                  <div>• American Wire THHN: ₱3,800.00</div>
                                  <div>• Philflex THHN: ₱3,600.00</div>
                                  <div>3.5mm² x 150m</div>
                                </div>
                              </div>
                              <div className="font-medium">₱3,600.00 - ₱4,200.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">PVC Pipes (per piece)</div>
                                <div className="text-sm text-muted-foreground">
                                  <div>• Neltex Premium: ₱380.00</div>
                                  <div>• Atlanta Standard: ₱350.00</div>
                                  <div>• Moldex Regular: ₱320.00</div>
                                  <div>4" x 3m Sanitary</div>
                                </div>
                              </div>
                              <div className="font-medium">₱320.00 - ₱380.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Paint (per gallon)</div>
                                <div className="text-sm text-muted-foreground">
                                  <div>• Boysen Premium: ₱1,850.00</div>
                                  <div>• Davies Elastomeric: ₱1,750.00</div>
                                  <div>• Rain or Shine: ₱1,650.00</div>
                                  <div>Exterior Acrylic</div>
                                </div>
                              </div>
                              <div className="font-medium">₱1,650.00 - ₱1,850.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Tiles (per sqm)</div>
                                <div className="text-sm text-muted-foreground">
                                  <div>• Mariwasa Premium: ₱580.00</div>
                                  <div>• Arte Series: ₱520.00</div>
                                  <div>• Eurotiles Standard: ₱480.00</div>
                                  <div>60x60 Ceramic</div>
                                </div>
                              </div>
                              <div className="font-medium">₱480.00 - ₱580.00</div>
                            </div>
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                                <div>
                                  <span className="font-medium">Note:</span>
                                  <p>Prices are approximate and may vary by location and quantity. Last updated: February 2024. Contact suppliers for exact quotations.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button className="w-full" onClick={() => {
                            toast({
                              title: "Material Database",
                              description: "Complete material database will be available in the next update."
                            });
                          }}>
                            Download Full Database
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Fee Proposal Generator
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Fee Proposal Generator</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label>Project Value (PHP)</Label>
                            <Input type="number" placeholder="Enter project value" />
                          </div>
                          <div>
                            <Label>Service Scope</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service scope" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full">Full Architectural Services</SelectItem>
                                <SelectItem value="design">Design Development Only</SelectItem>
                                <SelectItem value="documentation">Construction Documents Only</SelectItem>
                                <SelectItem value="supervision">Construction Supervision Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Project Location</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="metro-manila">Metro Manila</SelectItem>
                                <SelectItem value="provincial">Provincial</SelectItem>
                                <SelectItem value="international">International</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full" onClick={() => {
                            toast({
                              title: "Proposal Generated",
                              description: "Advanced fee proposal generator will be available in the next update."
                            });
                          }}>
                            Generate Proposal
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Resources */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">Professional Resources</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Practice Guidelines',
                        items: [
                          'UAP Minimum Standards for Registration',
                          'PRC Resolution No. 1439 Guidelines',
                          'AAIF Code of Ethics and Responsibilities',
                          'DPWH Design Guidelines and Standards',
                          'Philippine Green Building Code Requirements',
                          'Construction Occupational Safety Guidelines',
                          'Professional Liability Requirements',
                          'Environmental Compliance Certificates'
                        ]
                      },
                      {
                        title: 'Client Relations',
                        items: [
                          'Standard Client-Architect Agreement Forms',
                          'UAP Project Delivery Guidelines',
                          'Professional Fee Guidelines 2024',
                          'Client Presentation Templates',
                          'Project Milestone Documentation',
                          'Change Order Procedures',
                          'Site Visit Report Templates',
                          'Client Feedback and Evaluation Forms'
                        ]
                      },
                      {
                        title: 'Financial Management',
                        items: [
                          'UAP Professional Fee Calculator',
                          'Project Cost Estimation Templates',
                          'Payment Schedule Guidelines',
                          'Construction Cost Database 2024',
                          'VAT and Tax Compliance Guide',
                          'Professional Insurance Requirements',
                          'Contract Payment Terms Templates',
                          'Financial Report Formats'
                        ]
                      },
                      {
                        title: 'Quality Control',
                        items: [
                          'DPWH Quality Assurance Manual',
                          'Construction Specifications Template',
                          'Site Inspection Checklist',
                          'Material Testing Requirements',
                          'As-Built Documentation Guidelines',
                          'Project Completion Certificates',
                          'Warranty Documentation Templates',
                          'Building Maintenance Guidelines'
                        ]
                      }
                    ].map(section => (
                      <div key={section.title} className="space-y-2">
                        {section.items.map(item => (
                          <Button
                            key={item}
                            variant="outline"
                            className="w-full justify-start h-auto py-3"
                            onClick={() => {
                              toast({
                                title: item,
                                description: "This resource will be available in the next update."
                              });
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {item}
                          </Button>
                        ))}
                      </div>
                    ))}
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