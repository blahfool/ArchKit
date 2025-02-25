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
  PlusCircle,
  Image,
  FileText,
  Layout,
  Download,
  Edit,
  Trash2,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  thumbnailUrl?: string;
  lastEdited: Date;
}

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
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    type: ''
  });

  const { toast } = useToast();

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.type) {
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
      lastEdited: new Date()
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({ title: '', description: '', type: '' });
    setIsNewProjectOpen(false);

    toast({
      title: "Project Created",
      description: "Your new project has been created successfully."
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Project Deleted",
      description: "The project has been removed from your portfolio."
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
                  <DialogContent>
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
                                toast({
                                  title: "Edit Project",
                                  description: "Project editing will be available soon."
                                });
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
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
                      <div className="aspect-[3/2] bg-secondary rounded-lg mb-3 flex items-center justify-center">
                        <Layout className="h-8 w-8 text-muted-foreground" />
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

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Tools & Resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 px-6" onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Image templates will be available in the next update."
                });
              }}>
                <Image className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Image Templates</div>
                  <div className="text-sm text-muted-foreground">Professional layout designs</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6" onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Documentation templates will be available in the next update."
                });
              }}>
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Documentation</div>
                  <div className="text-sm text-muted-foreground">Project documentation guides</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6" onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Case study templates will be available in the next update."
                });
              }}>
                <Layout className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Case Studies</div>
                  <div className="text-sm text-muted-foreground">Sample case study formats</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6" onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Export options will be available in the next update."
                });
              }}>
                <Download className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export Options</div>
                  <div className="text-sm text-muted-foreground">PDF and digital formats</div>
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