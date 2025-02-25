import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { Camera, Ruler, Maximize2, Move, RotateCcw, ArrowLeft } from "lucide-react";

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
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight }
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

  const calculateDistance = (point1: {x: number, y: number}, point2: {x: number, y: number}) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);

    // Convert pixel distance to meters using calibration factor
    const calibrationFactor = calibrated ? 0.01 : 0.015; // meters per pixel
    return pixelDistance * calibrationFactor;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measuring) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = [...points, {x, y}];
    setPoints(newPoints);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw point
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw line between points
    if (points.length > 0) {
      const prevPoint = points[points.length - 1];
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(prevPoint.x, prevPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Calculate and display distance
      const dist = calculateDistance(prevPoint, {x, y});
      setDistance(dist);

      // Draw distance text
      ctx.fillStyle = '#00ff00';
      ctx.font = '20px sans-serif';
      ctx.fillText(
        `${dist.toFixed(2)}m`,
        (prevPoint.x + x) / 2,
        (prevPoint.y + y) / 2 - 10
      );
    }

    // If in area mode and we have enough points, close the shape
    if (mode === 'area' && newPoints.length > 2) {
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(newPoints[0].x, newPoints[0].y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const handleCalibrate = () => {
    setCalibrated(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Draw calibration guide
    ctx.strokeStyle = '#00ff00';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 50, canvas.height / 2);
    ctx.lineTo(canvas.width / 2 + 50, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw calibration text
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px sans-serif';
    ctx.fillText('Place a reference object (e.g., A4 paper) here', canvas.width / 2 - 100, canvas.height / 2 - 20);
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
    <div className="fixed inset-0 bg-black">
      {/* Full screen camera view */}
      <div className="relative w-full h-full">
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

        {/* Measurement UI overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-2 mb-4">
            <Button 
              variant={mode === 'distance' ? 'default' : 'outline'}
              onClick={() => setMode('distance')}
              className="flex-1 bg-white/10 hover:bg-white/20"
            >
              <Ruler className="mr-2 h-4 w-4" />
              Distance
            </Button>
            <Button 
              variant={mode === 'area' ? 'default' : 'outline'}
              onClick={() => setMode('area')}
              className="flex-1 bg-white/10 hover:bg-white/20"
            >
              <Maximize2 className="mr-2 h-4 w-4" />
              Area
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-white/10 hover:bg-white/20"
              onClick={() => setMeasuring(true)}
              disabled={measuring}
            >
              <Move className="mr-2 h-4 w-4" />
              Start Measuring
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-white/10 hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {!calibrated && (
            <Button 
              variant="outline" 
              className="w-full mt-2 bg-white/10 hover:bg-white/20"
              onClick={handleCalibrate}
            >
              <Camera className="mr-2 h-4 w-4" />
              Calibrate Camera
            </Button>
          )}

          {distance && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
              <p className="text-center text-white font-medium">
                {mode === 'distance' 
                  ? `Distance: ${distance.toFixed(2)} meters`
                  : `Area: ${(distance * distance).toFixed(2)} sq meters`
                }
              </p>
            </div>
          )}

          <p className="mt-4 text-sm text-white/70 text-center">
            {measuring 
              ? "Tap points on the screen to measure between them" 
              : "Tap Start Measuring and calibrate the camera for accurate measurements"
            }
          </p>
        </div>

        {/* Back button in top-left corner */}
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}