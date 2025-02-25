import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Image, 
  FileText, 
  Layout,
  Download
} from "lucide-react";

export default function Portfolio() {
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
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample project cards */}
                <Card className="relative group">
                  <CardContent className="p-4">
                    <div className="aspect-[3/2] bg-secondary rounded-lg mb-3 flex items-center justify-center">
                      <Layout className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">Residential Project</h3>
                    <p className="text-sm text-muted-foreground">Last edited: 2 days ago</p>
                  </CardContent>
                </Card>

                <Card className="relative group">
                  <CardContent className="p-4">
                    <div className="aspect-[3/2] bg-secondary rounded-lg mb-3 flex items-center justify-center">
                      <Layout className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium mb-1">Commercial Complex</h3>
                    <p className="text-sm text-muted-foreground">Last edited: 5 days ago</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Tools & Resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 px-6">
                <Image className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Image Templates</div>
                  <div className="text-sm text-muted-foreground">Professional layout designs</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6">
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Documentation</div>
                  <div className="text-sm text-muted-foreground">Project documentation guides</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6">
                <Layout className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Case Studies</div>
                  <div className="text-sm text-muted-foreground">Sample case study formats</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto py-4 px-6">
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
