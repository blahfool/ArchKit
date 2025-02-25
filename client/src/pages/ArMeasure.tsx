import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Ruler, Maximize2, Move, RotateCcw, ArrowLeft } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

export default function ArMeasure() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [measuring, setMeasuring] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [mode, setMode] = useState<'distance'|'area'>('distance');
  const [points, setPoints] = useState<Point[]>([]);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
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
          videoRef.current.onloadeddata = () => {
            setCameraReady(true);
            initCanvas();
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    initCamera();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const initCanvas = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    drawGuideLines();
  };

  const drawGuideLines = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw measurement points and lines
    points.forEach((point, index) => {
      // Draw point
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Draw line to previous point
      if (index > 0) {
        const prevPoint = points[index - 1];
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        // Calculate and display distance
        const dist = calculateDistance(prevPoint, point);
        const textX = (prevPoint.x + point.x) / 2;
        const textY = (prevPoint.y + point.y) / 2 - 20;

        // Draw text background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.font = '20px sans-serif';
        const text = `${dist.toFixed(2)}m`;
        const textWidth = ctx.measureText(text).width;
        ctx.fillRect(textX - textWidth/2 - 10, textY - 24, textWidth + 20, 36);

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(text, textX, textY);
      }
    });

    if (measuring) {
      requestAnimationFrame(drawGuideLines);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measuring || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setPoints(prev => [...prev, { x, y }]);

    if (points.length === 1) {
      const dist = calculateDistance(points[0], { x, y });
      setDistance(dist);
    }
  };

  const calculateDistance = (point1: Point, point2: Point): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);

    // Convert pixels to meters (approximation)
    // This can be calibrated based on known reference objects
    return pixelDistance * 0.001;
  };

  const handleReset = () => {
    setMeasuring(false);
    setPoints([]);
    setDistance(null);
    drawGuideLines();
  };

  return (
    <div className="fixed inset-0 bg-black">
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

        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 backdrop-blur-sm space-y-4">
          <div className="flex gap-2">
            <Button 
              variant={mode === 'distance' ? 'default' : 'outline'}
              onClick={() => setMode('distance')}
              className="flex-1 bg-white/10 hover:bg-white/20 h-14"
            >
              <Ruler className="h-5 w-5 mr-2" />
              Distance
            </Button>
            <Button 
              variant={mode === 'area' ? 'default' : 'outline'}
              onClick={() => setMode('area')}
              className="flex-1 bg-white/10 hover:bg-white/20 h-14"
            >
              <Maximize2 className="h-5 w-5 mr-2" />
              Area
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-white/10 hover:bg-white/20 h-14"
              onClick={() => {
                setMeasuring(true);
                drawGuideLines();
              }}
              disabled={measuring || !cameraReady}
            >
              <Move className="h-5 w-5 mr-2" />
              Start Measuring
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-white/10 hover:bg-white/20 h-14 px-4"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          {distance && (
            <div className="p-4 bg-white/10 rounded-lg border border-white/20">
              <p className="text-center text-white font-medium">
                {mode === 'distance' 
                  ? `Distance: ${distance.toFixed(2)}m`
                  : `Area: ${(distance * distance).toFixed(2)} sq meters`
                }
              </p>
            </div>
          )}

          <p className="text-sm text-white/70 text-center">
            {measuring 
              ? "Tap to place measurement points"
              : "Point camera at surface and tap Start Measuring"
            }
          </p>
        </div>
      </div>
    </div>
  );
}