import { type Theme } from "@/types/theme";

interface TextureOptions {
  size: number;
  spacing: number;
  opacity: number;
  rotation: number;
  pattern: "grid" | "dots" | "diagonal" | "triangles" | "hexagonal";
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
  drawPattern(ctx, pattern, theme);

  // Return base64 image
  return canvas.toDataURL('image/png');
}

function getThemePattern(theme: Theme): TextureOptions {
  switch (theme.name.toLowerCase()) {
    case 'modern':
    case 'modern dark':
      return {
        size: 100,
        spacing: 20,
        opacity: 0.05,
        rotation: 45,
        pattern: "grid"
      };
    case 'brutalist':
    case 'brutalist dark':
      return {
        size: 120,
        spacing: 40,
        opacity: 0.08,
        rotation: 0,
        pattern: "diagonal"
      };
    case 'warm minimal':
    case 'warm minimal dark':
      return {
        size: 80,
        spacing: 15,
        opacity: 0.04,
        rotation: 30,
        pattern: "dots"
      };
    case 'industrial':
    case 'industrial dark':
      return {
        size: 150,
        spacing: 30,
        opacity: 0.06,
        rotation: -45,
        pattern: "triangles"
      };
    case 'earthen':
    case 'earthen dark':
      return {
        size: 90,
        spacing: 25,
        opacity: 0.05,
        rotation: 15,
        pattern: "hexagonal"
      };
    default:
      return {
        size: 100,
        spacing: 20,
        opacity: 0.04,
        rotation: 0,
        pattern: "grid"
      };
  }
}

function drawPattern(ctx: CanvasRenderingContext2D, options: TextureOptions, theme: Theme): void {
  const { size, spacing, opacity, rotation, pattern } = options;

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

  // Set stroke style based on theme appearance
  ctx.strokeStyle = theme.appearance === 'dark' ? '#ffffff' : '#000000';
  ctx.lineWidth = theme.appearance === 'dark' ? 0.75 : 0.5;

  switch (pattern) {
    case "grid":
      drawGrid(ctx, size, spacing);
      break;
    case "dots":
      drawDots(ctx, size, spacing);
      break;
    case "diagonal":
      drawDiagonal(ctx, size, spacing);
      break;
    case "triangles":
      drawTriangles(ctx, size, spacing);
      break;
    case "hexagonal":
      drawHexagonal(ctx, size, spacing);
      break;
  }

  // Restore context
  ctx.restore();
}

function drawGrid(ctx: CanvasRenderingContext2D, size: number, spacing: number): void {
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

  ctx.stroke();
}

function drawDots(ctx: CanvasRenderingContext2D, size: number, spacing: number): void {
  for (let x = spacing; x < size; x += spacing) {
    for (let y = spacing; y < size; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawDiagonal(ctx: CanvasRenderingContext2D, size: number, spacing: number): void {
  ctx.beginPath();

  // Diagonal lines in one direction
  for (let i = -size; i <= size * 2; i += spacing) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
  }

  // Diagonal lines in opposite direction
  for (let i = -size; i <= size * 2; i += spacing) {
    ctx.moveTo(i, size);
    ctx.lineTo(i + size, 0);
  }

  ctx.stroke();
}

function drawTriangles(ctx: CanvasRenderingContext2D, size: number, spacing: number): void {
  const h = spacing * Math.sin(Math.PI / 3);

  for (let x = 0; x < size + spacing; x += spacing) {
    for (let y = 0; y < size + h; y += h) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + spacing/2, y + h);
      ctx.lineTo(x - spacing/2, y + h);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function drawHexagonal(ctx: CanvasRenderingContext2D, size: number, spacing: number): void {
  const a = spacing / 2;
  const b = a * Math.sin(Math.PI / 3);

  for (let x = 0; x < size + spacing; x += 3 * a) {
    for (let y = 0; y < size + b; y += 2 * b) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const px = x + a * Math.cos(angle);
        const py = y + a * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
}