import { type Theme } from "@/types/theme";

interface TextureOptions {
  size: number;
  spacing: number;
  opacity: number;
  rotation: number;
}

const DEFAULT_SIZE = 100;

export function generateTexture(theme: Theme): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set canvas size
  canvas.width = DEFAULT_SIZE;
  canvas.height = DEFAULT_SIZE;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get theme-specific pattern
  const pattern = getThemePattern(theme);
  
  // Draw the pattern
  drawPattern(ctx, pattern);

  // Return base64 image
  return canvas.toDataURL('image/png');
}

function getThemePattern(theme: Theme): TextureOptions {
  switch (theme.name.toLowerCase()) {
    case 'modern':
      return {
        size: 100,
        spacing: 20,
        opacity: 0.03,
        rotation: 45
      };
    case 'brutalist':
      return {
        size: 120,
        spacing: 40,
        opacity: 0.05,
        rotation: 0
      };
    case 'warm minimal':
      return {
        size: 80,
        spacing: 15,
        opacity: 0.02,
        rotation: 30
      };
    case 'industrial':
      return {
        size: 150,
        spacing: 30,
        opacity: 0.04,
        rotation: -45
      };
    case 'earthen':
      return {
        size: 90,
        spacing: 25,
        opacity: 0.03,
        rotation: 15
      };
    default:
      return {
        size: 100,
        spacing: 20,
        opacity: 0.03,
        rotation: 0
      };
  }
}

function drawPattern(ctx: CanvasRenderingContext2D, options: TextureOptions): void {
  const { size, spacing, opacity, rotation } = options;
  
  // Save context state
  ctx.save();
  
  // Set global opacity
  ctx.globalAlpha = opacity;
  
  // Rotate context if needed
  if (rotation) {
    ctx.translate(size/2, size/2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-size/2, -size/2);
  }
  
  // Draw grid pattern
  ctx.beginPath();
  
  // Vertical lines
  for (let x = 0; x <= size; x += spacing) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
  }
  
  // Horizontal lines
  for (let y = 0; y <= size; y += spacing) {
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
  }
  
  // Style and stroke
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  
  // Restore context
  ctx.restore();
}
