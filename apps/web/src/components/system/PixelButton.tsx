import type { ButtonHTMLAttributes } from "react";

export function PixelButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`pixel-button ${className}`} {...props} />;
}
