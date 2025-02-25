import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import { Github, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">About ArchKit</h1>

      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 space-y-6">
          <div className="prose prose-sm dark:prose-invert">
            <h2 className="text-2xl font-semibold mb-4">The Developer</h2>
            <p>
              Hi! I'm Rani, the developer behind ArchKit. I created this tool to help
              architecture students have an easier time with their studies and exam
              preparation.
            </p>

            <div className="my-8 p-4 bg-primary/5 rounded-lg">
              <p className="italic text-muted-foreground">
                Dedicating this project to Pey, my {"<3"}. Wishing you all the success
                in your architectural journey!
              </p>
              <Heart className="text-red-500 mt-2 mx-auto h-6 w-6" />
            </div>

            <h3 className="text-xl font-semibold mb-3">Key Features</h3>
            <ul>
              <li>Architectural formula calculator with common equations</li>
              <li>Comprehensive terms index with detailed architectural definitions</li>
              <li>AR measurement tool for quick spatial estimates</li>
              <li>Advanced online exam generator with challenging questions</li>
              <li>Study progress tracking with detailed analytics</li>
              <li>Professional E-Book library with study resources</li>
              <li>Portfolio builder for showcasing work</li>
              <li>Building codes reference and guidelines</li>
              <li>Professional tools for practicing architects</li>
              <li>Complete offline functionality with PWA support</li>
              <li>Enhanced dark mode with improved visibility</li>
              <li>Multi-format question types for exam preparation</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Tech Stack</h3>
            <p>
              Built with React, Tailwind CSS, and modern web technologies. Deployed as a Progressive
              Web App for seamless offline access on any device.
            </p>

            <div className="flex items-center justify-center mt-8 gap-2">
              <Github className="h-5 w-5" />
              <a 
                href="https://github.com/rani/archkit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <BackButton />
    </div>
  );
}