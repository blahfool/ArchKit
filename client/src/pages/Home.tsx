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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Blueprint grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <Card className="w-full max-w-lg bg-background/60 backdrop-blur border-primary/20">
        <CardContent className="pt-8 pb-6">
          <h1 className="text-5xl font-light text-center mb-2 tracking-tight">
            Arch<span className="font-bold">Kit</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Architecture Student's Toolkit
          </p>

          <div className="grid grid-cols-2 gap-4 p-2">
            {menuItems.map((item, index) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${index === menuItems.length - 1 ? "col-span-2" : ""}`}
              >
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 
                           hover:bg-primary/5 hover:border-primary/30 transition-all
                           hover:shadow-lg hover:-translate-y-0.5"
                >
                  <item.icon className="h-6 w-6" />
                  <span className="font-light tracking-wide">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}