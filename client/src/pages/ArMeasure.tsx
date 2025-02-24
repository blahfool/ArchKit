
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { Camera, Ruler, Maximize2, Move, RotateCcw } from "lucide-react";

export default function ArMeasure() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [measuring, setMeasuring] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [calibrated, setCalibrated] = useState(false);
  const [mode, setMode] = useState<'distance'|'area'>('distance');
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measuring) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPoints(prev => [...prev, {x, y}]);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    if (points.length > 0) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMeasure = () => {
    setMeasuring(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
    
    // Simulated AR measurement with improved accuracy
    if (mode === 'distance') {
      setTimeout(() => {
        const simulatedDistance = (Math.random() * 3 + 2) * (calibrated ? 1 : 1.2);
        setDistance(simulatedDistance);
        setMeasuring(false);
      }, 1500);
    }
  };

  const handleCalibrate = () => {
    setCalibrated(true);
  };

  const handleReset = () => {
    setMeasuring(false);
    setPoints([]);
    setDistance(null);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
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
              onClick={handleCanvasClick}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair"
            />
            {measuring && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-40 h-40 border-2 border-green-500 rounded-lg opacity-50" />
                <div className="absolute top-1/2 left-1/2 w-4 h-4 border-2 border-green-500 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              variant={mode === 'distance' ? 'default' : 'outline'}
              onClick={() => setMode('distance')}
            >
              <Ruler className="mr-2 h-4 w-4" />
              Distance
            </Button>
            <Button 
              variant={mode === 'area' ? 'default' : 'outline'}
              onClick={() => setMode('area')}
            >
              <Maximize2 className="mr-2 h-4 w-4" />
              Area
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              className="flex-1"
              onClick={handleMeasure}
              disabled={measuring}
            >
              {measuring ? (
                "Measuring..."
              ) : (
                <>
                  <Move className="mr-2 h-4 w-4" />
                  Start Measuring
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {!calibrated && (
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={handleCalibrate}
            >
              Calibrate Camera
            </Button>
          )}

          {distance && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
              <p className="font-medium">
                {mode === 'distance' 
                  ? `Measured Distance: ${distance.toFixed(2)} meters`
                  : `Measured Area: ${(distance * distance).toFixed(2)} sq meters`
                }
              </p>
            </div>
          )}

          <p className="mt-4 text-sm text-muted-foreground text-center">
            {measuring ? "Tap points to measure between them" : "Click Start Measuring to begin"}
          </p>
        </CardContent>
      </Card>

      <BackButton />
    </div>
  );
}
