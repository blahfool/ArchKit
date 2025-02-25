import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Ruler, Maximize2, Move, RotateCcw } from "lucide-react";
import BackButton from "@/components/BackButton";
import { getCalibrationData, saveCalibrationData } from "@/lib/offlineStorage";
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default function ArMeasure() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [measuring, setMeasuring] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [calibrated, setCalibrated] = useState(false);
  const [calibrationFactor, setCalibrationFactor] = useState(0.015);
  const [mode, setMode] = useState<'distance'|'area'>('distance');
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [detectedPlanes, setDetectedPlanes] = useState<any[]>([]);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };

    loadModel();
  }, []);

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
          if (canvasRef.current) {
            const { videoWidth, videoHeight } = videoRef.current;
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
          }

          // Start plane detection once video is playing
          videoRef.current.onloadeddata = () => {
            detectPlanesInVideo();
          };
        }

        // Load saved calibration
        const savedCalibration = await getCalibrationData();
        if (savedCalibration) {
          setCalibrationFactor(savedCalibration);
          setCalibrated(true);
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

  const detectPlanesInVideo = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    const detectFrame = async () => {
      const predictions = await model.detect(videoRef.current!);
      const planes = predictions.filter(pred => 
        ['floor', 'wall', 'ceiling', 'table', 'desk'].includes(pred.class.toLowerCase())
      );
      setDetectedPlanes(planes);
      drawDetectedPlanes(planes);
      requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  const drawDetectedPlanes = (planes: any[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw detected planes with semi-transparent overlay
    planes.forEach(plane => {
      const [x, y, width, height] = plane.bbox;
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Add surface label
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#00ff00';
      ctx.font = '16px sans-serif';
      ctx.fillText(plane.class, x, y - 5);
    });

    // Draw measurement points and lines
    points.forEach((point, index) => {
      // Draw point
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
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
        const text = `${dist.toFixed(2)}m`;

        // Draw text background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const textWidth = ctx.measureText(text).width;
        ctx.fillRect(textX - textWidth/2 - 10, textY - 24, textWidth + 20, 36);

        // Draw text
        ctx.fillStyle = '#00ff00';
        ctx.textAlign = 'center';
        ctx.font = '24px sans-serif';
        ctx.fillText(text, textX, textY);
      }
    });
  };

  const calculateDistance = (point1: {x: number, y: number}, point2: {x: number, y: number}) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);

    // Apply scale factor based on detected plane dimensions
    const scaleFactor = getScaleFactorFromPlanes(point1, point2);
    return pixelDistance * calibrationFactor * scaleFactor;
  };

  const getScaleFactorFromPlanes = (point1: {x: number, y: number}, point2: {x: number, y: number}) => {
    // Find the plane that contains both points
    const relevantPlane = detectedPlanes.find(plane => {
      const [x, y, width, height] = plane.bbox;
      return (
        point1.x >= x && point1.x <= x + width &&
        point1.y >= y && point1.y <= y + height &&
        point2.x >= x && point2.x <= x + width &&
        point2.y >= y && point2.y <= y + height
      );
    });

    // Apply different scale factors based on plane orientation
    if (relevantPlane) {
      switch (relevantPlane.class.toLowerCase()) {
        case 'wall': return 1.2;
        case 'floor': return 1.5;
        case 'table': return 0.8;
        default: return 1.0;
      }
    }

    return 1.0;
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
  };

  const handleCalibrate = async () => {
    // Use standard object dimensions for calibration
    const standardObjectWidth = 0.2159; // Width of A4 paper in meters
    setCalibrationFactor(standardObjectWidth / 500); // Assuming 500px is standard width
    setCalibrated(true);
    await saveCalibrationData(calibrationFactor);
  };

  const handleReset = () => {
    setMeasuring(false);
    setPoints([]);
    setDistance(null);
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
                className="h-14 text-lg"
              >
                <Ruler className="h-5 w-5 mr-2" />
                Distance
              </Button>
              <Button 
                variant={mode === 'area' ? 'default' : 'outline'}
                onClick={() => setMode('area')}
                className="h-14 text-lg"
              >
                <Maximize2 className="h-5 w-5 mr-2" />
                Area
              </Button>
            </div>

            {/* Measurement Controls */}
            <div className="flex gap-2">
              <Button 
                className="flex-1 h-14 text-lg"
                onClick={() => setMeasuring(true)}
                disabled={measuring}
              >
                <Move className="h-5 w-5 mr-2" />
                Start Measuring
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="h-14 px-4"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>

            {/* Calibration Button */}
            {!calibrated && (
              <Button 
                variant="outline" 
                className="w-full h-14 text-lg"
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
                    ? `Distance: ${distance.toFixed(2)}m`
                    : `Area: ${(distance * distance).toFixed(2)} sq meters`
                  }
                </p>
              </div>
            )}

            {/* Help Text */}
            <p className="text-base text-muted-foreground text-center px-4">
              {measuring 
                ? "Tap points on detected surfaces to measure"
                : "Point camera at surfaces to detect and measure"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <BackButton />
    </div>
  );
}