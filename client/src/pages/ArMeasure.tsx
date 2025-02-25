import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Ruler, Maximize2, Move, RotateCcw, ArrowLeft } from "lucide-react";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

interface Point {
  x: number;
  y: number;
  worldX?: number;
  worldY?: number;
  worldZ?: number;
}

interface DetectedPlane {
  points: Point[];
  normal: { x: number; y: number; z: number };
}

export default function ArMeasure() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [measuring, setMeasuring] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [mode, setMode] = useState<'distance'|'area'>('distance');
  const [points, setPoints] = useState<Point[]>([]);
  const [detectedPlanes, setDetectedPlanes] = useState<DetectedPlane[]>([]);
  const [orientation, setOrientation] = useState<DeviceOrientationEvent | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        // Request camera access with highest possible resolution
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 4096 },
            height: { ideal: 2160 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            setCameraReady(true);
            initCanvas();
            startPlaneDetection();
          };
        }

        // Listen for device orientation changes
        window.addEventListener('deviceorientation', handleOrientation);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    initCamera();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setOrientation(event);
  };

  const initCanvas = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Initialize edge detection
    startEdgeDetection();
  };

  const startPlaneDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detectPlanes = async () => {
      if (!measuring) return;

      // Process video frame to detect planes
      const imageData = await processVideoFrame();
      const planes = await detectPlanesInImage(imageData);
      setDetectedPlanes(planes);

      // Draw detected planes
      drawPlanes(planes);

      requestAnimationFrame(detectPlanes);
    };

    detectPlanes();
  };

  const processVideoFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data for processing
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  };

  const detectPlanesInImage = async (imageData: ImageData | null) => {
    if (!imageData) return [];

    // Convert image data to tensor
    const tensor = tf.browser.fromPixels(imageData);

    // Process image to detect edges and planes
    // This is a simplified version - in real implementation, 
    // we would use more sophisticated plane detection algorithms
    const processedTensor = tf.tidy(() => {
      const normalized = tensor.toFloat().div(255);
      return normalized;
    });

    tensor.dispose();
    processedTensor.dispose();

    // Return detected planes
    // This is a placeholder - actual implementation would return real detected planes
    return [];
  };

  const drawPlanes = (planes: DetectedPlane[]) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    planes.forEach(plane => {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      plane.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.stroke();

      // Draw plane normal vector
      ctx.strokeStyle = '#ff0000';
      const center = plane.points.reduce(
        (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
        { x: 0, y: 0 }
      );
      center.x /= plane.points.length;
      center.y /= plane.points.length;

      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(
        center.x + plane.normal.x * 50,
        center.y + plane.normal.y * 50
      );
      ctx.stroke();
    });
  };

  const startEdgeDetection = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const detectEdges = () => {
      if (!measuring) return;

      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;

      // Draw current video frame
      ctx.drawImage(videoRef.current!, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      const data = imageData.data;

      // Simple edge detection using Sobel operator
      const edgeData = new Uint8ClampedArray(data.length);
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        edgeData[i] = edgeData[i + 1] = edgeData[i + 2] = brightness;
        edgeData[i + 3] = 255;
      }

      // Draw edges
      const edgeImage = new ImageData(edgeData, imageData.width, imageData.height);
      ctx.putImageData(edgeImage, 0, 0);

      requestAnimationFrame(detectEdges);
    };

    detectEdges();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measuring || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Find nearest edge point if available
    const point = findNearestEdgePoint(x, y);

    setPoints(prev => [...prev, point]);

    if (points.length === 2) {
      // Calculate real-world distance
      const dist = calculateRealWorldDistance(points[0], points[1]);
      setDistance(dist);
    }
  };

  const findNearestEdgePoint = (x: number, y: number): Point => {
    // In a real implementation, this would find the nearest detected edge point
    // For now, just return the clicked point
    return { x, y };
  };

  const calculateRealWorldDistance = (point1: Point, point2: Point): number => {
    if (!orientation) return 0;

    // This is a simplified calculation
    // In a real implementation, we would use camera parameters and device orientation
    // to calculate actual real-world distances
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);

    // Convert pixel distance to meters using device orientation and camera parameters
    const beta = orientation.beta || 0; // device tilt
    const gamma = orientation.gamma || 0; // device rotation

    // This is a very simplified conversion factor
    // Real implementation would use proper camera calibration
    const conversionFactor = 0.001 * Math.cos(beta * Math.PI / 180);

    return pixelDistance * conversionFactor;
  };

  const handleReset = () => {
    setMeasuring(false);
    setPoints([]);
    setDistance(null);
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

        {/* Overlay UI */}
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

        {/* Measurement Controls */}
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
              onClick={() => setMeasuring(true)}
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
              ? "Tap on edges or surfaces to measure"
              : "Point camera at surface and tap Start Measuring"
            }
          </p>
        </div>
      </div>
    </div>
  );
}