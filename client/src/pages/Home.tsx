import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calculator, 
  BookOpen, 
  Ruler, 
  Book, 
  Info, 
  LineChart, 
  Briefcase, 
  FileCode, 
  PenSquare,
  ClipboardList
} from "lucide-react";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Check if animation has already played in this session
    const hasAnimationPlayed = sessionStorage.getItem('animationPlayed');
    if (hasAnimationPlayed) {
      setShowAnimation(false);
    } else {
      sessionStorage.setItem('animationPlayed', 'true');
    }
  }, []);

  const menuItems = [
    { icon: Calculator, label: "Calculator", href: "/calculator" },
    { icon: BookOpen, label: "Terms Index", href: "/terms" },
    { icon: Ruler, label: "AR Measure", href: "/ar" },
    { icon: ClipboardList, label: "Assessment", href: "/exam" },
    { icon: LineChart, label: "Progress", href: "/progress" },
    { icon: Book, label: "E-Book", href: "/ebook" },
    { icon: PenSquare, label: "Portfolio Builder", href: "/portfolio" },
    { icon: FileCode, label: "Building Codes", href: "/codes" },
    { icon: Briefcase, label: "Professional Tools", href: "/professional" },
    { icon: Info, label: "About", href: "/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Initial Logo Animation */}
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center logo-animation">
          <div className="text-6xl font-light tracking-wide">
            <span className="logo-letter">A</span>
            <span className="logo-letter">r</span>
            <span className="logo-letter">c</span>
            <span className="logo-letter">h</span>
            <span className="logo-letter font-bold">K</span>
            <span className="logo-letter font-bold">i</span>
            <span className="logo-letter font-bold">t</span>
          </div>
        </div>
      )}

      {/* Animated background elements */}
      <div 
        className={`absolute inset-0 pointer-events-none ${showAnimation ? 'opacity-0 animate-fade-in' : 'opacity-50'}`}
        style={{
          background: `
            linear-gradient(45deg, 
              rgba(229, 231, 235, 0.05) 25%, 
              transparent 25%,
              transparent 75%,
              rgba(229, 231, 235, 0.05) 75%,
              rgba(229, 231, 235, 0.05)
            )
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Blueprint grid with animation */}
      <div 
        className={`absolute inset-0 ${showAnimation ? 'opacity-0 animate-grid-appear' : 'opacity-[0.03]'} pointer-events-none`}
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-10 left-10 w-40 h-40 border border-primary/20 rounded-full ${showAnimation ? 'opacity-0 animate-shape-appear' : 'opacity-100'}`} />
        <div className={`absolute bottom-20 right-20 w-60 h-60 border border-primary/10 rotate-45 ${showAnimation ? 'opacity-0 animate-shape-appear' : 'opacity-100'}`}
          style={{ animationDelay: '0.2s' }} />
        <div className={`absolute top-1/2 left-1/4 w-20 h-20 border border-primary/30 ${showAnimation ? 'opacity-0 animate-shape-appear' : 'opacity-100'}`}
          style={{ animationDelay: '0.4s' }} />
      </div>

      <Card className={`w-full max-w-lg bg-background/60 backdrop-blur border-primary/20 ${showAnimation ? 'opacity-0 animate-content-appear' : 'opacity-100'}`}>
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
                            hover:shadow-lg hover:-translate-y-0.5
                            active:scale-95 touch-manipulation"
                >
                  <item.icon className="h-8 w-8" />
                  <span className="font-medium text-lg tracking-wide">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}