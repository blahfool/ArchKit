import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { Camera, Ruler } from "lucide-react";

export default function ArMeasure() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [measuring, setMeasuring] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleMeasure = () => {
    setMeasuring(true);
    // Basic simulation of AR measurement
    setTimeout(() => {
      setDistance(Math.random() * 5 + 1);
      setMeasuring(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">AR Measurement</h1>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>

          <Button 
            className="w-full mt-4"
            onClick={handleMeasure}
            disabled={measuring}
          >
            {measuring ? (
              "Measuring..."
            ) : (
              <>
                <Ruler className="mr-2 h-4 w-4" />
                Measure Distance
              </>
            )}
          </Button>

          {distance && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
              <p className="font-medium">
                Measured Distance: {distance.toFixed(2)} meters
              </p>
            </div>
          )}

          <p className="mt-4 text-sm text-muted-foreground text-center">
            Point your camera at the object you want to measure
          </p>
        </CardContent>
      </Card>

      <BackButton />
    </div>
  );
}
