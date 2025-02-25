import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Ruler, Maximize2, Move, RotateCcw } from "lucide-react";
import BackButton from "@/components/BackButton";

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
        const constraints = {
          video: {
            facingMode: "environment",
            aspectRatio: 4/3,
            width: { ideal: 1024 },
            height: { ideal: 768 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Set canvas size to match video
          if (canvasRef.current) {
            const { videoWidth, videoHeight } = videoRef.current;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
          }
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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const newPoints = [...points, {x, y}];
    setPoints(newPoints);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all points and lines
    newPoints.forEach((point, index) => {
      // Draw point
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI); // Increased point size
      ctx.fill();

      // Draw line to previous point
      if (index > 0) {
        const prevPoint = newPoints[index - 1];
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 4; // Increased line width
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        // Calculate and display distance
        const dist = calculateDistance(prevPoint, point);
        setDistance(dist);

        // Draw distance text with background
        const textX = (prevPoint.x + point.x) / 2;
        const textY = (prevPoint.y + point.y) / 2 - 30; // Increased spacing
        const text = `${dist.toFixed(2)}m`;

        ctx.font = '28px sans-serif'; // Larger font
        const textWidth = ctx.measureText(text).width;

        // Draw text background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(textX - textWidth/2 - 10, textY - 24, textWidth + 20, 36);

        // Draw text
        ctx.fillStyle = '#00ff00';
        ctx.textAlign = 'center';
        ctx.fillText(text, textX, textY);
      }
    });
  };

  const handleCalibrate = () => {
    setCalibrated(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Draw calibration guide
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 4;
    ctx.setLineDash([12, 12]);

    // Draw horizontal line
    const centerY = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - 150, centerY);
    ctx.lineTo(canvas.width/2 + 150, centerY);
    ctx.stroke();

    // Draw text with background
    const text = 'Place a reference object (e.g., A4 paper) along this line';
    ctx.font = '24px sans-serif'; // Larger font
    const textWidth = ctx.measureText(text).width;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(
      canvas.width/2 - textWidth/2 - 15,
      centerY - 60,
      textWidth + 30,
      48
    );

    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'center';
    ctx.setLineDash([]);
    ctx.fillText(text, canvas.width/2, centerY - 24);
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
    <div className="min-h-screen p-3 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-center">AR Measurement</h1>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-3">
          {/* Camera View */}
          <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="absolute inset-0 w-full h-full touch-none"
            />
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Mode Selection */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={mode === 'distance' ? 'default' : 'outline'}
                onClick={() => setMode('distance')}
                className="h-14 text-lg" // Taller button, larger text
              >
                <Ruler className="h-5 w-5 mr-2" />
                Distance
              </Button>
              <Button 
                variant={mode === 'area' ? 'default' : 'outline'}
                onClick={() => setMode('area')}
                className="h-14 text-lg" // Taller button, larger text
              >
                <Maximize2 className="h-5 w-5 mr-2" />
                Area
              </Button>
            </div>

            {/* Measurement Controls */}
            <div className="flex gap-2">
              <Button 
                className="flex-1 h-14 text-lg" // Taller button, larger text
                onClick={() => setMeasuring(true)}
                disabled={measuring}
              >
                <Move className="h-5 w-5 mr-2" />
                Start Measuring
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="h-14 px-4" // Taller button, more padding
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* Calibration Button */}
            {!calibrated && (
              <Button 
                variant="outline" 
                className="w-full h-14 text-lg" // Taller button, larger text
                onClick={handleCalibrate}
              >
                <Camera className="h-5 w-5 mr-2" />
                Calibrate Camera
              </Button>
            )}

            {/* Measurement Results */}
            {distance && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-center text-lg font-medium">
                  {mode === 'distance' 
                    ? `Distance: ${distance.toFixed(2)} meters`
                    : `Area: ${(distance * distance).toFixed(2)} sq meters`
                  }
                </p>
              </div>
            )}

            {/* Help Text */}
            <p className="text-base text-muted-foreground text-center px-4">
              {measuring 
                ? "Tap points on the screen to measure between them" 
                : "Click Start Measuring and calibrate the camera for accurate measurements"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <BackButton />
    </div>
  );
}