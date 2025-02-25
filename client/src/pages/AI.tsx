import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon, Download } from "lucide-react";
import BackButton from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";
import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';

export default function AI() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize TensorFlow.js
    async function initTF() {
      await tf.ready();
      await tf.setBackend('webgl');
    }
    initTF();
  }, []);

  // Function to generate architectural patterns using TensorFlow.js
  const generateArchitecturalPattern = async (seed: number, complexity: number) => {
    const size = 256; // Output size
    
    // Create a random noise matrix
    const noiseShape = [size, size, 3];
    const noise = tf.randomNormal(noiseShape, 0, 1, 'float32', seed);
    
    // Apply architectural pattern transformations
    const pattern = tf.tidy(() => {
      // Create geometric patterns
      const x = tf.linspace(0, 2 * Math.PI, size);
      const y = tf.linspace(0, 2 * Math.PI, size);
      const [gridX, gridY] = tf.meshgrid(x, y);
      
      // Generate architectural elements
      const lines = tf.sin(gridX.mul(complexity)).add(tf.cos(gridY.mul(complexity)));
      const circles = tf.sqrt(gridX.square().add(gridY.square())).div(complexity);
      
      // Combine patterns
      const combined = lines.add(circles).div(2);
      
      // Add noise and normalize
      return combined.expandDims(2).tile([1, 1, 3])
        .add(noise.mul(0.2))
        .clipByValue(0, 1);
    });

    // Convert to image data
    const imageData = await tf.browser.toPixels(pattern as tf.Tensor3D);
    pattern.dispose();

    // Create canvas and context
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Put image data and convert to base64
    const imageDataObj = new ImageData(imageData, size, size);
    ctx.putImageData(imageDataObj, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Use the prompt to generate a seed and complexity
      const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const complexity = (prompt.length % 10) + 5;
      
      const imageUrl = await generateArchitecturalPattern(seed, complexity);
      setGeneratedImage(imageUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'architectural-pattern.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">AI Design Assistant</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Describe what you want to generate
                </label>
                <Textarea
                  placeholder="Enter a description of the architectural pattern you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Pattern
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {generatedImage && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <img
                  src={generatedImage}
                  alt="Generated architectural pattern"
                  className="w-full rounded-lg shadow-lg"
                />
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <BackButton />
    </div>
  );
}
