import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Set canvas size to match video
          if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    // Handle orientation changes
    const handleResize = () => {
      if (canvasRef.current && videoRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      window.removeEventListener('resize', handleResize);
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

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all points and lines
    newPoints.forEach((point, index) => {
      // Draw point
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw line to previous point
      if (index > 0) {
        const prevPoint = newPoints[index - 1];
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        // Calculate and display distance
        const dist = calculateDistance(prevPoint, point);
        setDistance(dist);

        // Draw distance text with background
        const textX = (prevPoint.x + point.x) / 2;
        const textY = (prevPoint.y + point.y) / 2 - 20;
        const text = `${dist.toFixed(2)}m`;

        ctx.font = '24px sans-serif';
        const textWidth = ctx.measureText(text).width;

        // Draw text background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(textX - textWidth/2 - 5, textY - 20, textWidth + 10, 30);

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
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);

    // Draw horizontal line
    const centerY = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 - 100, centerY);
    ctx.lineTo(canvas.width/2 + 100, centerY);
    ctx.stroke();

    // Draw text with background
    const text = 'Place a reference object (e.g., A4 paper) along this line';
    ctx.font = '20px sans-serif';
    const textWidth = ctx.measureText(text).width;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(
      canvas.width/2 - textWidth/2 - 10,
      centerY - 50,
      textWidth + 20,
      40
    );

    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'center';
    ctx.setLineDash([]);
    ctx.fillText(text, canvas.width/2, centerY - 20);
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
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="absolute inset-0 w-full h-full touch-none"
        />

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {!calibrated && (
            <Button 
              variant="secondary"
              onClick={handleCalibrate}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              Calibrate
            </Button>
          )}
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={mode === 'distance' ? 'default' : 'outline'}
              onClick={() => setMode('distance')}
              className="flex-1 bg-white/10 hover:bg-white/20"
            >
              <Ruler className="h-4 w-4 mr-2" />
              Distance
            </Button>
            <Button 
              variant={mode === 'area' ? 'default' : 'outline'}
              onClick={() => setMode('area')}
              className="flex-1 bg-white/10 hover:bg-white/20"
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Area
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-white/10 hover:bg-white/20"
              onClick={() => setMeasuring(true)}
              disabled={measuring}
            >
              <Move className="h-4 w-4 mr-2" />
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

          {measuring && (
            <p className="text-center text-white/70 text-sm">
              Tap points on the screen to measure distances
            </p>
          )}

          {distance && (
            <div className="p-4 bg-white/10 rounded-lg border border-white/20">
              <p className="text-center text-white font-medium">
                {mode === 'distance' 
                  ? `Distance: ${distance.toFixed(2)} meters`
                  : `Area: ${(distance * distance).toFixed(2)} sq meters`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}