import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BookOpen, Ruler, PenTool, Info } from "lucide-react";

export default function Home() {
  const menuItems = [
    { icon: Calculator, label: "Calculator", href: "/calculator" },
    { icon: BookOpen, label: "Terms Index", href: "/terms" },
    { icon: Ruler, label: "AR Measure", href: "/ar" },
    { icon: PenTool, label: "Exam Generator", href: "/exam" },
    { icon: Info, label: "About", href: "/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/60 backdrop-blur">
        <CardContent className="pt-6">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ArchKit
          </h1>
          
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10"
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
