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
  ClipboardList,
  ChevronRight,
  Share2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    const hasAnimationPlayed = sessionStorage.getItem('animationPlayed');
    if (hasAnimationPlayed) {
      setShowAnimation(false);
    } else {
      sessionStorage.setItem('animationPlayed', 'true');
    }

    setCanShare(navigator.share !== undefined);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'ArchKit - Architecture Student\'s Toolkit',
        text: 'Check out ArchKit, a comprehensive toolkit for architecture students and professionals!',
        url: window.location.href
      });
      toast({
        title: "Success",
        description: "Thanks for sharing ArchKit!",
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to share. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const menuItems = [
    {
      icon: Calculator,
      label: "Calculator",
      href: "/calculator",
      description: "Essential architectural calculations and formulas"
    },
    {
      icon: BookOpen,
      label: "Terms Index",
      href: "/terms",
      description: "Comprehensive architectural terminology guide"
    },
    {
      icon: Ruler,
      label: "AR Measure",
      href: "/ar",
      description: "Augmented reality measurement tools"
    },
    {
      icon: ClipboardList,
      label: "Assessment",
      href: "/exam",
      description: "Test your architectural knowledge"
    },
    {
      icon: LineChart,
      label: "Progress",
      href: "/progress",
      description: "Track your learning journey"
    },
    {
      icon: Book,
      label: "E-Book",
      href: "/ebook",
      description: "Digital architectural resources"
    },
    {
      icon: PenSquare,
      label: "Portfolio Builder",
      href: "/portfolio",
      description: "Create and showcase your work"
    },
    {
      icon: FileCode,
      label: "Building Codes",
      href: "/codes",
      description: "Access building regulations and standards"
    },
    {
      icon: Briefcase,
      label: "Professional Tools",
      href: "/professional",
      description: "Resources for practicing architects"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 relative overflow-hidden">
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center logo-animation">
          <div className="text-6xl font-light tracking-wide text-primary">
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

      <div
        className={`absolute inset-0 pointer-events-none ${showAnimation ? 'opacity-0 animate-fade-in' : 'opacity-50'}`}
        style={{
          background: `
            linear-gradient(45deg, 
              rgba(var(--primary), 0.05) 25%, 
              transparent 25%,
              transparent 75%,
              rgba(var(--primary), 0.05) 75%,
              rgba(var(--primary), 0.05)
            )
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div
        className={`absolute inset-0 ${showAnimation ? 'opacity-0 animate-grid-appear' : 'opacity-[0.03]'} pointer-events-none`}
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      <div className={`w-full max-w-4xl mx-auto text-center pt-12 pb-8 ${showAnimation ? 'opacity-0 animate-content-appear' : 'opacity-100'}`}>
        <h1 className="text-5xl sm:text-6xl font-light mb-4 tracking-tight">
          <span className="text-primary">Arch</span>
          <span className="font-bold text-primary">Kit</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-lg mx-auto">
          Your complete toolkit for architecture studies and professional practice
        </p>
        {canShare && (
          <Button
            onClick={handleShare}
            variant="outline"
            className="gap-2 hover:bg-primary/5"
          >
            <Share2 className="h-4 w-4" />
            Share ArchKit
          </Button>
        )}
      </div>

      <div className={`w-full max-w-4xl mx-auto ${showAnimation ? 'opacity-0 animate-content-appear' : 'opacity-100'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="rounded-full bg-primary/5 p-3 transition-colors group-hover:bg-primary/10">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 tracking-wide">{item.label}</h2>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-primary/40 transition-transform group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Link href="/about" className="block mt-6">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 py-6"
          >
            <Info className="h-5 w-5" />
            <span>About ArchKit</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}