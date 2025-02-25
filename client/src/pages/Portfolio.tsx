import { useState, useRef } from "react";
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
  PlusCircle,
  Image as ImageIcon,
  FileText,
  Layout,
  Download,
  Edit,
  Trash2,
  MoreVertical,
  Upload,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveAs } from 'file-saver';

interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  thumbnailUrl?: string;
  lastEdited: Date;
  template?: string;
  content?: {
    overview?: string;
    challenge?: string;
    solution?: string;
    outcome?: string;
  };
}

const projectTemplates = [
  { id: 'residential', name: 'Residential Project' },
  { id: 'commercial', name: 'Commercial Project' },
  { id: 'institutional', name: 'Institutional Project' },
  { id: 'interior', name: 'Interior Design' },
  { id: 'landscape', name: 'Landscape Design' },
];

const generateImageTemplate = (type: string) => {
  const template = {
    presentation: `
Project Presentation Template
----------------------------
1. Cover Page
2. Project Overview
3. Site Analysis
4. Design Concept
5. Floor Plans
6. Elevations
7. Sections
8. Renderings
9. Details
10. Sustainability Features`,
    documentation: `
Project Documentation Template
-----------------------------
1. Executive Summary
2. Project Scope
3. Design Intent
4. Technical Specifications
5. Material Schedule
6. Construction Details
7. Sustainability Features
8. Cost Estimates
9. Timeline
10. Appendices`,
    caseStudy: `
Case Study Template
------------------
1. Project Background
2. Design Challenge
3. Solution Approach
4. Implementation
5. Results & Impact
6. Lessons Learned
7. Client Testimonials
8. Project Images
9. Technical Details
10. Awards & Recognition`
  };

  return new Blob([template[type] || template.presentation], { type: 'text/plain;charset=utf-8' });
};


export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Residential Project',
      description: 'Modern sustainable home design',
      type: 'Residential',
      lastEdited: new Date('2024-02-23')
    },
    {
      id: '2',
      title: 'Commercial Complex',
      description: 'Mixed-use development in urban setting',
      type: 'Commercial',
      lastEdited: new Date('2024-02-20')
    }
  ]);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isViewProjectOpen, setIsViewProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    type: '',
    template: '',
    content: {
      overview: '',
      challenge: '',
      solution: '',
      outcome: ''
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleImageUpload = (projectId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProjects(prev => prev.map(p =>
        p.id === projectId
          ? { ...p, thumbnailUrl: e.target?.result as string }
          : p
      ));
      toast({
        title: "Image Uploaded",
        description: "Project thumbnail has been updated successfully."
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.type || !newProject.template) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      type: newProject.type,
      template: newProject.template,
      content: newProject.content,
      lastEdited: new Date()
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({
      title: '',
      description: '',
      type: '',
      template: '',
      content: {
        overview: '',
        challenge: '',
        solution: '',
        outcome: ''
      }
    });
    setIsNewProjectOpen(false);

    toast({
      title: "Project Created",
      description: "Your new project has been created successfully."
    });
  };

  const handleEditProject = () => {
    if (!selectedProject) return;

    setProjects(prev => prev.map(p =>
      p.id === selectedProject.id
        ? { ...selectedProject, lastEdited: new Date() }
        : p
    ));
    setIsEditProjectOpen(false);

    toast({
      title: "Project Updated",
      description: "Your project has been updated successfully."
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Project Deleted",
      description: "The project has been removed from your portfolio."
    });
  };

  const handleExport = (project: Project) => {
    const content = `
# ${project.title}
## ${project.type}

${project.description}

### Overview
${project.content?.overview || ''}

### Challenge
${project.content?.challenge || ''}

### Solution
${project.content?.solution || ''}

### Outcome
${project.content?.outcome || ''}

Last edited: ${project.lastEdited.toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-portfolio.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Project Exported",
      description: "Your project has been exported successfully."
    });
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Portfolio Builder</h1>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Create and organize your architectural portfolio with professional templates
                </p>
                <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="title">Project Title*</Label>
                        <Input
                          id="title"
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter project title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="template">Project Template*</Label>
                        <Select
                          value={newProject.template}
                          onValueChange={(value) => setNewProject(prev => ({ ...prev, template: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTemplates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="type">Project Type*</Label>
                        <Input
                          id="type"
                          value={newProject.type}
                          onChange={(e) => setNewProject(prev => ({ ...prev, type: e.target.value }))}
                          placeholder="e.g., Residential, Commercial, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newProject.description}
                          onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your project"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>Project Details</Label>
                        <div>
                          <Label htmlFor="overview" className="text-sm">Overview</Label>
                          <Textarea
                            id="overview"
                            value={newProject.content.overview}
                            onChange={(e) => setNewProject(prev => ({
                              ...prev,
                              content: { ...prev.content, overview: e.target.value }
                            }))}
                            placeholder="Project overview"
                          />
                        </div>
                        <div>
                          <Label htmlFor="challenge" className="text-sm">Challenge</Label>
                          <Textarea
                            id="challenge"
                            value={newProject.content.challenge}
                            onChange={(e) => setNewProject(prev => ({
                              ...prev,
                              content: { ...prev.content, challenge: e.target.value }
                            }))}
                            placeholder="Project challenges"
                          />
                        </div>
                        <div>
                          <Label htmlFor="solution" className="text-sm">Solution</Label>
                          <Textarea
                            id="solution"
                            value={newProject.content.solution}
                            onChange={(e) => setNewProject(prev => ({
                              ...prev,
                              content: { ...prev.content, solution: e.target.value }
                            }))}
                            placeholder="Your solution"
                          />
                        </div>
                        <div>
                          <Label htmlFor="outcome" className="text-sm">Outcome</Label>
                          <Textarea
                            id="outcome"
                            value={newProject.content.outcome}
                            onChange={(e) => setNewProject(prev => ({
                              ...prev,
                              content: { ...prev.content, outcome: e.target.value }
                            }))}
                            placeholder="Project outcomes"
                          />
                        </div>
                      </div>
                      <Button onClick={handleCreateProject} className="w-full">
                        Create Project
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="relative group">
                    <CardContent className="p-4">
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProject(project);
                                setIsViewProjectOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProject(project);
                                setIsEditProjectOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleExport(project)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div
                        className="aspect-[3/2] bg-secondary rounded-lg mb-3 relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {project.thumbnailUrl ? (
                          <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Layout className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(project.id, file);
                          }}
                        />
                      </div>
                      <h3 className="font-medium mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{project.type}</p>
                      <p className="text-sm text-muted-foreground">
                        Last edited: {project.lastEdited.toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Project Dialog */}
        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="edit-title">Project Title</Label>
                <Input
                  id="edit-title"
                  value={selectedProject?.title}
                  onChange={(e) => setSelectedProject(prev =>
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Project Type</Label>
                <Input
                  id="edit-type"
                  value={selectedProject?.type}
                  onChange={(e) => setSelectedProject(prev =>
                    prev ? { ...prev, type: e.target.value } : null
                  )}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedProject?.description}
                  onChange={(e) => setSelectedProject(prev =>
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                />
              </div>
              <div className="space-y-4">
                <Label>Project Details</Label>
                <div>
                  <Label htmlFor="edit-overview" className="text-sm">Overview</Label>
                  <Textarea
                    id="edit-overview"
                    value={selectedProject?.content?.overview}
                    onChange={(e) => setSelectedProject(prev =>
                      prev ? {
                        ...prev,
                        content: { ...prev.content, overview: e.target.value }
                      } : null
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-challenge" className="text-sm">Challenge</Label>
                  <Textarea
                    id="edit-challenge"
                    value={selectedProject?.content?.challenge}
                    onChange={(e) => setSelectedProject(prev =>
                      prev ? {
                        ...prev,
                        content: { ...prev.content, challenge: e.target.value }
                      } : null
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-solution" className="text-sm">Solution</Label>
                  <Textarea
                    id="edit-solution"
                    value={selectedProject?.content?.solution}
                    onChange={(e) => setSelectedProject(prev =>
                      prev ? {
                        ...prev,
                        content: { ...prev.content, solution: e.target.value }
                      } : null
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-outcome" className="text-sm">Outcome</Label>
                  <Textarea
                    id="edit-outcome"
                    value={selectedProject?.content?.outcome}
                    onChange={(e) => setSelectedProject(prev =>
                      prev ? {
                        ...prev,
                        content: { ...prev.content, outcome: e.target.value }
                      } : null
                    )}
                  />
                </div>
              </div>
              <Button onClick={handleEditProject} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Project Dialog */}
        <Dialog open={isViewProjectOpen} onOpenChange={setIsViewProjectOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedProject?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              {selectedProject?.thumbnailUrl && (
                <div className="aspect-[16/9] rounded-lg overflow-hidden">
                  <img
                    src={selectedProject.thumbnailUrl}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg">{selectedProject?.type}</h3>
                <p className="text-muted-foreground">{selectedProject?.description}</p>
              </div>
              {selectedProject?.content && (
                <div className="space-y-4">
                  {selectedProject.content.overview && (
                    <div>
                      <h4 className="font-medium">Overview</h4>
                      <p className="text-muted-foreground">{selectedProject.content.overview}</p>
                    </div>
                  )}
                  {selectedProject.content.challenge && (
                    <div>
                      <h4 className="font-medium">Challenge</h4>
                      <p className="text-muted-foreground">{selectedProject.content.challenge}</p>
                    </div>
                  )}
                  {selectedProject.content.solution && (
                    <div>
                      <h4 className="font-medium">Solution</h4>
                      <p className="text-muted-foreground">{selectedProject.content.solution}</p>
                    </div>
                  )}
                  {selectedProject.content.outcome && (
                    <div>
                      <h4 className="font-medium">Outcome</h4>
                      <p className="text-muted-foreground">{selectedProject.content.outcome}</p>
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleExport(selectedProject!)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={() => {
                  setSelectedProject(selectedProject);
                  setIsViewProjectOpen(false);
                  setIsEditProjectOpen(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Tools & Resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 px-6" onClick={() => {
                const blob = generateImageTemplate('presentation');
                saveAs(blob, 'presentation-template.txt');
                toast({
                  title: "Template Downloaded",
                  description: "Presentation template has been downloaded to your device."
                });
              }}>
                <ImageIcon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Image Templates</div>
                  <div className="text-sm text-muted-foreground">Professional layout designs</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6" onClick={() => {
                const blob = generateImageTemplate('documentation');
                saveAs(blob, 'documentation-template.txt');
                toast({
                  title: "Template Downloaded",
                  description: "Documentation template has been downloaded to your device."
                });
              }}>
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Documentation</div>
                  <div className="text-sm text-muted-foreground">Project documentation guides</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6" onClick={() => {
                const blob = generateImageTemplate('caseStudy');
                saveAs(blob, 'case-study-template.txt');
                toast({
                  title: "Template Downloaded",
                  description: "Case study template has been downloaded to your device."
                });
              }}>
                <Layout className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Case Studies</div>
                  <div className="text-sm text-muted-foreground">Sample case study formats</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6" onClick={() => {
                if (selectedProject) {
                  const projectData = JSON.stringify(selectedProject, null, 2);
                  const blob = new Blob([projectData], { type: 'application/json' });
                  saveAs(blob, `${selectedProject.title.toLowerCase().replace(/\s+/g, '-')}.json`);
                  toast({
                    title: "Project Exported",
                    description: "Project data has been exported successfully."
                  });
                } else {
                  toast({
                    title: "No Project Selected",
                    description: "Please select a project to export.",
                    variant: "destructive"
                  });
                }
              }}>
                <Download className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export Options</div>
                  <div className="text-sm text-muted-foreground">Export project data</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BackButton />
    </div>
  );
}