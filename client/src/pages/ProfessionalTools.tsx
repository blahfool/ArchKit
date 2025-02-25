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
  Trash2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
                      <Button variant="outline" className="w-full justify-start"
                        onClick={() => {
                          toast({
                            title: "Template Generated",
                            description: "Contract template has been downloaded."
                          });
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Contract Templates
                      </Button>
                      <Button variant="outline" className="w-full justify-start"
                        onClick={() => {
                          toast({
                            title: "Template Generated",
                            description: "Specification template has been downloaded."
                          });
                        }}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Specifications
                      </Button>
                      <Button variant="outline" className="w-full justify-start"
                        onClick={() => {
                          toast({
                            title: "Template Generated",
                            description: "Client form template has been downloaded."
                          });
                        }}
                      >
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
                                <SelectItem value="industrial">Industrial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Floor Area (sq ft)</Label>
                            <Input type="number" placeholder="Enter floor area" />
                          </div>
                          <div>
                            <Label>Quality Grade</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select quality grade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="luxury">Luxury</SelectItem>
                                <SelectItem value="high">High End</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
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
                                <div className="font-medium">Concrete (per cubic yard)</div>
                                <div className="text-sm text-muted-foreground">Standard mix, 4000 PSI</div>
                              </div>
                              <div className="font-medium">$125.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Steel Reinforcement (per ton)</div>
                                <div className="text-sm text-muted-foreground">Grade 60</div>
                              </div>
                              <div className="font-medium">$1,200.00</div>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">Lumber (per board foot)</div>
                                <div className="text-sm text-muted-foreground">Construction grade</div>
                              </div>
                              <div className="font-medium">$3.50</div>
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
                            <Label>Project Value</Label>
                            <Input type="number" placeholder="Enter project value" />
                          </div>
                          <div>
                            <Label>Service Scope</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service scope" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full">Full Service</SelectItem>
                                <SelectItem value="design">Design Only</SelectItem>
                                <SelectItem value="supervision">Supervision Only</SelectItem>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-auto py-4 px-6">
                          <FileText className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Practice Guidelines</div>
                            <div className="text-sm text-muted-foreground">Standard procedures</div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Practice Guidelines</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            {[
                              'Project Management Procedures',
                              'Quality Control Guidelines',
                              'Client Communication Protocol',
                              'Document Control Systems'
                            ].map(guide => (
                              <Button
                                key={guide}
                                variant="outline"
                                className="w-full justify-start h-auto py-3"
                                onClick={() => {
                                  toast({
                                    title: guide,
                                    description: "This guide will be available in the next update."
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {guide}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-auto py-4 px-6">
                          <Users className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Client Relations</div>
                            <div className="text-sm text-muted-foreground">Communication guides</div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Client Relations Resources</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            {[
                              'Client Meeting Templates',
                              'Presentation Guidelines',
                              'Communication Best Practices',
                              'Client Feedback Forms'
                            ].map(resource => (
                              <Button
                                key={resource}
                                variant="outline"
                                className="w-full justify-start h-auto py-3"
                                onClick={() => {
                                  toast({
                                    title: resource,
                                    description: "This resource will be available in the next update."
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {resource}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-auto py-4 px-6">
                          <CalcIcon className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Financial Tools</div>
                            <div className="text-sm text-muted-foreground">Budgeting resources</div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Financial Management Tools</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            {[
                              'Project Budget Templates',
                              'Cash Flow Forecasting',
                              'Fee Calculation Guides',
                              'Financial Report Templates'
                            ].map(tool => (
                              <Button
                                key={tool}
                                variant="outline"
                                className="w-full justify-start h-auto py-3"
                                onClick={() => {
                                  toast({
                                    title: tool,
                                    description: "This tool will be available in the next update."
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {tool}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-auto py-4 px-6">
                          <CheckSquare className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-medium">Quality Control</div>
                            <div className="text-sm text-muted-foreground">Review checklists</div>
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Quality Control Resources</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            {[
                              'Design Review Checklist',
                              'Construction Document Review',
                              'Site Inspection Forms',
                              'Quality Assurance Guidelines'
                            ].map(resource => (
                              <Button
                                key={resource}
                                variant="outline"
                                className="w-full justify-start h-auto py-3"
                                onClick={() => {
                                  toast({
                                    title: resource,
                                    description: "This resource will be available in the next update."
                                  });
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                {resource}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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