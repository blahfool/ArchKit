import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Logo({ size = 40, className, ...props }: LogoProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform duration-300 hover:scale-105"
      >
        {/* A triangle for the letter A */}
        <path
          d="M20 4L34 36H6L20 4Z"
          className="stroke-foreground"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Horizontal line in the A */}
        <line
          x1="13"
          y1="25"
          x2="27"
          y2="25"
          className="stroke-foreground"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}